"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { RouteApiError } from "@/lib/api/route-error";
import {
  changeLoggedUserPassword,
  updateLoggedUser,
} from "@/lib/api/users";
import { parseInternalPath } from "@/lib/auth/return-path";
import {
  clearRouteToken,
  getRouteToken,
  setRouteToken,
} from "@/lib/auth/session";

export type ProfileField = "name" | "email" | "phone";
export type PasswordField = "currentPassword" | "password" | "rePassword";

export type ProfileMutationState =
  | {
      error: "invalid" | "exists" | "failed";
      fieldErrors?: Partial<Record<ProfileField, string>>;
    }
  | { ok: true }
  | null;

export type PasswordMutationState =
  | {
      error: "invalid" | "current" | "failed";
      fieldErrors?: Partial<Record<PasswordField, string>>;
    }
  | { ok: true }
  | null;

const localeSchema = z.enum(routing.locales);
const egyptianMobile = /^01[0125]\d{8}$/;
const profileInputSchema = z.object({
  name: z.string().trim().min(3, "nameMin"),
  email: z.string().trim().pipe(z.email("email")),
  phone: z.string().trim().regex(egyptianMobile, "phone"),
});
const passwordInputSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPassword"),
    password: z.string().min(6, "passwordMin"),
    rePassword: z.string(),
  })
  .refine((value) => value.password === value.rePassword, {
    path: ["rePassword"],
    error: "rePassword",
  });

function redirectToSignIn(locale: z.infer<typeof localeSchema>) {
  const next = parseInternalPath("/account");

  redirect({
    href: next ? { pathname: "/sign-in", query: { next } } : "/sign-in",
    locale,
  });
}

async function requireToken(locale: z.infer<typeof localeSchema>) {
  const token = await getRouteToken();

  if (!token) {
    redirectToSignIn(locale);
    return null;
  }

  return token;
}

function mapFieldErrors<T extends string>(
  error: z.ZodError,
  allowed: readonly T[],
): Partial<Record<T, string>> {
  const fieldErrors: Partial<Record<T, string>> = {};
  const allowedSet = new Set<string>(allowed);

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && allowedSet.has(field)) {
      fieldErrors[field as T] = issue.message || field;
    }
  }

  return fieldErrors;
}

function profileErrorFromRoute(
  error: RouteApiError,
): Exclude<Extract<ProfileMutationState, { error: string }>["error"], "invalid"> {
  const normalized = error.apiMessage?.trim().toLowerCase() ?? "";

  if (
    error.status === 409 ||
    normalized.includes("already exists") ||
    normalized.includes("e11000")
  ) {
    return "exists";
  }

  return "failed";
}

function passwordErrorFromRoute(
  error: RouteApiError,
): Exclude<Extract<PasswordMutationState, { error: string }>["error"], "invalid"> {
  const normalized = error.apiMessage?.trim().toLowerCase() ?? "";

  if (normalized.includes("current password") || normalized.includes("incorrect")) {
    return "current";
  }

  return "failed";
}

async function handleAuthError(
  error: unknown,
  locale: z.infer<typeof localeSchema>,
): Promise<boolean> {
  if (!(error instanceof RouteApiError) || error.status !== 401) {
    return false;
  }

  const normalized = error.apiMessage?.trim().toLowerCase() ?? "";

  if (normalized.includes("current password") || normalized.includes("incorrect")) {
    return false;
  }

  await clearRouteToken();
  redirectToSignIn(locale);
  return true;
}

export async function updateProfileAction(
  _prev: ProfileMutationState,
  formData: FormData,
): Promise<ProfileMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const input = profileInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!locale.success) {
    return { error: "invalid" };
  }

  if (!input.success) {
    return {
      error: "invalid",
      fieldErrors: mapFieldErrors(input.error, ["name", "email", "phone"]),
    };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await updateLoggedUser(token, input.data);
  } catch (error) {
    if (await handleAuthError(error, locale.data)) {
      return null;
    }

    if (error instanceof RouteApiError) {
      console.error(`profile ${error.status}`);
      return { error: profileErrorFromRoute(error) };
    }

    throw error;
  }

  revalidatePath("/[locale]/account", "page");
  return { ok: true };
}

export async function changePasswordAction(
  _prev: PasswordMutationState,
  formData: FormData,
): Promise<PasswordMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const input = passwordInputSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    rePassword: formData.get("rePassword"),
  });

  if (!locale.success) {
    return { error: "invalid" };
  }

  if (!input.success) {
    return {
      error: "invalid",
      fieldErrors: mapFieldErrors(input.error, [
        "currentPassword",
        "password",
        "rePassword",
      ]),
    };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  let nextToken: string | null;

  try {
    nextToken = await changeLoggedUserPassword(token, input.data);
  } catch (error) {
    if (await handleAuthError(error, locale.data)) {
      return null;
    }

    if (error instanceof RouteApiError) {
      console.error(`password ${error.status}`);
      return { error: passwordErrorFromRoute(error) };
    }

    throw error;
  }

  if (nextToken) {
    await setRouteToken(nextToken);
  }

  revalidatePath("/[locale]/account", "page");
  return { ok: true };
}
