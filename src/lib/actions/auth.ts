"use server";

import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { signIn, signUp } from "@/lib/api/auth";
import { RouteApiError } from "@/lib/api/route-error";
import { hrefFromInternalPath } from "@/lib/auth/return-path";
import { hrefWithAuthFlash, type AuthFlash } from "@/lib/auth/auth-flash";
import {
  signInErrorFromRoute,
  type SignInActionError,
} from "@/lib/auth/sign-in-error";
import { signInSchema } from "@/lib/auth/sign-in-schema";
import {
  signUpErrorFromRoute,
  type SignUpActionError,
} from "@/lib/auth/sign-up-error";
import { signUpSchema } from "@/lib/auth/sign-up-schema";
import { clearRouteToken, setRouteToken } from "@/lib/auth/session";

export type SignUpState = { error: SignUpActionError } | null;
export type SignInState = { error: SignInActionError } | null;

const localeSchema = z.enum(routing.locales);

function actionFailure(label: string, error: unknown) {
  if (error instanceof RouteApiError) {
    console.error(`${label} ${error.status}`);
    return { kind: "route" as const, error };
  }

  if (error instanceof TypeError) {
    console.error(`${label} network`);
    return { kind: "network" as const };
  }

  throw error;
}

async function persistSessionAndRedirect(
  token: string,
  formData: FormData,
  locale: z.infer<typeof localeSchema>,
  flash: AuthFlash,
) {
  await setRouteToken(token);
  redirect({
    href: hrefWithAuthFlash(hrefFromInternalPath(formData.get("next")), flash),
    locale,
  });
}

export async function signUpAction(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    rePassword: formData.get("rePassword"),
    phone: formData.get("phone"),
  });
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!parsed.success || !locale.success) {
    return { error: "invalid" };
  }

  let token: string;

  try {
    token = await signUp(parsed.data);
  } catch (error) {
    const failure = actionFailure("signup", error);

    if (failure.kind === "network") {
      return { error: "failed" };
    }

    return { error: signUpErrorFromRoute(failure.error.status, failure.error.apiMessage) };
  }

  await persistSessionAndRedirect(token, formData, locale.data, "signed-up");
  return null;
}

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!parsed.success || !locale.success) {
    return { error: "invalid" };
  }

  let token: string;

  try {
    token = await signIn(parsed.data);
  } catch (error) {
    const failure = actionFailure("signin", error);

    if (failure.kind === "network") {
      return { error: "failed" };
    }

    return { error: signInErrorFromRoute(failure.error.status, failure.error.apiMessage) };
  }

  await persistSessionAndRedirect(token, formData, locale.data, "signed-in");
  return null;
}

export async function signOutAction(formData: FormData) {
  const locale = localeSchema.catch("en").parse(formData.get("locale"));
  await clearRouteToken();
  redirect({ href: "/", locale });
}
