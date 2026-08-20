"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { addAddress, getAddresses, removeAddress } from "@/lib/api/addresses";
import { RouteApiError } from "@/lib/api/route-error";
import { parseInternalPath } from "@/lib/auth/return-path";
import {
  clearRouteToken,
  getDefaultAddressId,
  getRouteToken,
  setDefaultAddressId,
} from "@/lib/auth/session";

export type AddressMutationState =
  | {
      error: "invalid" | "failed";
      fieldErrors?: Partial<
        Record<"name" | "details" | "phone" | "city", "name" | "details" | "phone" | "city">
      >;
    }
  | null;

const localeSchema = z.enum(routing.locales);
const addressIdSchema = z.string().min(1);
const addressInputSchema = z.object({
  name: z.string().trim().min(3),
  details: z.string().trim().min(5),
  phone: z.string().trim().min(6),
  city: z.string().trim().min(2),
});

function mapAddressFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<
    Record<"name" | "details" | "phone" | "city", "name" | "details" | "phone" | "city">
  > = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === "name" ||
      field === "details" ||
      field === "phone" ||
      field === "city"
    ) {
      fieldErrors[field] = field;
    }
  }

  return fieldErrors;
}

function redirectToSignIn(
  locale: z.infer<typeof localeSchema>,
  returnPath?: string,
) {
  const next = returnPath ? parseInternalPath(returnPath) : null;

  redirect({
    href: next ? { pathname: "/sign-in", query: { next } } : "/sign-in",
    locale,
  });
}

async function requireToken(locale: z.infer<typeof localeSchema>) {
  const token = await getRouteToken();

  if (!token) {
    redirectToSignIn(locale, "/addresses");
    return null;
  }

  return token;
}

async function handleAddressesError(
  error: unknown,
  locale: z.infer<typeof localeSchema>,
): Promise<AddressMutationState> {
  if (error instanceof RouteApiError && error.status === 401) {
    await clearRouteToken();
    redirectToSignIn(locale, "/addresses");
    return null;
  }

  if (error instanceof RouteApiError) {
    console.error(`addresses ${error.status}`);
    return { error: "failed" };
  }

  throw error;
}

export async function addAddressAction(
  _prev: AddressMutationState,
  formData: FormData,
): Promise<AddressMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const input = addressInputSchema.safeParse({
    name: formData.get("name"),
    details: formData.get("details"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  });

  if (!locale.success) {
    return { error: "invalid" };
  }

  if (!input.success) {
    return { error: "invalid", fieldErrors: mapAddressFieldErrors(input.error) };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await addAddress(token, input.data);
  } catch (error) {
    return handleAddressesError(error, locale.data);
  }

  revalidatePath("/[locale]/addresses", "page");
  return null;
}

export async function removeAddressAction(
  _prev: AddressMutationState,
  formData: FormData,
): Promise<AddressMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const addressId = addressIdSchema.safeParse(formData.get("addressId"));

  if (!locale.success || !addressId.success) {
    return { error: "invalid" };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await removeAddress(token, addressId.data);
  } catch (error) {
    return handleAddressesError(error, locale.data);
  }

  revalidatePath("/[locale]/addresses", "page");
  return null;
}

export async function replaceAddressAction(
  _prev: AddressMutationState,
  formData: FormData,
): Promise<AddressMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const oldAddressId = addressIdSchema.safeParse(formData.get("oldAddressId"));
  const input = addressInputSchema.safeParse({
    name: formData.get("name"),
    details: formData.get("details"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  });

  if (!locale.success || !oldAddressId.success) {
    return { error: "invalid" };
  }

  if (!input.success) {
    return { error: "invalid", fieldErrors: mapAddressFieldErrors(input.error) };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;
  const previousDefaultAddressId = await getDefaultAddressId();

  try {
    await addAddress(token, input.data);
    const addresses = await getAddresses(token);
    const replacement = addresses.find(
      (address) =>
        address._id !== oldAddressId.data &&
        address.name === input.data.name &&
        address.details === input.data.details &&
        address.phone === input.data.phone &&
        address.city === input.data.city,
    );
    await removeAddress(token, oldAddressId.data);

    if (previousDefaultAddressId === oldAddressId.data) {
      const nextDefaultId = replacement?._id ?? addresses[0]?._id;
      if (nextDefaultId) {
        await setDefaultAddressId(nextDefaultId);
      }
    }
  } catch (error) {
    return handleAddressesError(error, locale.data);
  }

  revalidatePath("/[locale]/addresses", "page");
  return null;
}

export async function setDefaultAddressAction(
  _prev: AddressMutationState,
  formData: FormData,
): Promise<AddressMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const addressId = addressIdSchema.safeParse(formData.get("addressId"));

  if (!locale.success || !addressId.success) {
    return { error: "invalid" };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  const addresses = await getAddresses(token);
  const exists = addresses.some((address) => address._id === addressId.data);
  if (!exists) {
    return { error: "invalid" };
  }

  await setDefaultAddressId(addressId.data);
  revalidatePath("/[locale]/addresses", "page");
  return null;
}
