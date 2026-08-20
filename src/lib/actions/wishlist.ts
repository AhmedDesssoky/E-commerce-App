"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  addWishlistItem,
  removeWishlistItem,
} from "@/lib/api/wishlist";
import { productIdSchema } from "@/lib/api/catalog";
import { RouteApiError } from "@/lib/api/route-error";
import { parseInternalPath } from "@/lib/auth/return-path";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export type WishlistMutationState = { error: true } | null;

const localeSchema = z.enum(routing.locales);

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
    redirectToSignIn(locale, "/wishlist");
    return null;
  }

  return token;
}

async function handleWishlistError(
  error: unknown,
  locale: z.infer<typeof localeSchema>,
): Promise<WishlistMutationState> {
  if (error instanceof RouteApiError && error.status === 401) {
    await clearRouteToken();
    redirectToSignIn(locale, "/wishlist");
    return null;
  }

  if (error instanceof RouteApiError) {
    console.error(`wishlist ${error.status}`);
    return { error: true };
  }

  throw error;
}

function revalidateWishlistSurfaces() {
  revalidatePath("/[locale]/wishlist", "page");
  revalidatePath("/[locale]/products", "page");
  revalidatePath("/[locale]/products/[id]", "page");
}

export async function addToWishlistAction(
  _prev: WishlistMutationState,
  formData: FormData,
): Promise<WishlistMutationState> {
  const productId = productIdSchema.safeParse(formData.get("productId"));
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!productId.success || !locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await addWishlistItem(token, productId.data);
  } catch (error) {
    return handleWishlistError(error, locale.data);
  }

  revalidateWishlistSurfaces();
  return null;
}

export async function removeFromWishlistAction(
  _prev: WishlistMutationState,
  formData: FormData,
): Promise<WishlistMutationState> {
  const productId = productIdSchema.safeParse(formData.get("productId"));
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!productId.success || !locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await removeWishlistItem(token, productId.data);
  } catch (error) {
    return handleWishlistError(error, locale.data);
  }

  revalidateWishlistSurfaces();
  return null;
}
