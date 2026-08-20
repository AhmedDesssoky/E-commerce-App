"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { productIdSchema } from "@/lib/api/catalog";
import { RouteApiError } from "@/lib/api/route-error";
import { parseInternalPath } from "@/lib/auth/return-path";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export type AddToCartState = { error: true } | null;
export type CartMutationState = { error: true } | null;

const localeSchema = z.enum(routing.locales);

function redirectToSignIn(
  locale: z.infer<typeof localeSchema>,
  returnPath?: string,
) {
  const next = returnPath ? parseInternalPath(returnPath) : null;

  redirect({
    href: next
      ? { pathname: "/sign-in", query: { next } }
      : "/sign-in",
    locale,
  });
}

async function requireToken(locale: z.infer<typeof localeSchema>) {
  const token = await getRouteToken();

  if (!token) {
    redirectToSignIn(locale, "/cart");
    return null;
  }

  return token;
}

async function handleCartError(
  error: unknown,
  locale: z.infer<typeof localeSchema>,
): Promise<CartMutationState> {
  if (error instanceof RouteApiError && error.status === 401) {
    await clearRouteToken();
    redirectToSignIn(locale, "/cart");
    return null;
  }

  if (error instanceof RouteApiError) {
    console.error(`cart ${error.status}`);
    return { error: true };
  }

  throw error;
}

export async function addToCartAction(
  _prev: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const parsed = productIdSchema.safeParse(formData.get("productId"));
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!parsed.success || !locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await addCartItem(token, parsed.data);
  } catch (error) {
    return handleCartError(error, locale.data);
  }

  redirect({ href: "/cart", locale: locale.data });
  return null;
}

export async function updateCartItemAction(
  _prev: CartMutationState,
  formData: FormData,
): Promise<CartMutationState> {
  const productId = productIdSchema.safeParse(formData.get("productId"));
  const count = z.coerce.number().int().min(1).safeParse(formData.get("count"));
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!productId.success || !count.success || !locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await updateCartItem(token, productId.data, count.data);
  } catch (error) {
    return handleCartError(error, locale.data);
  }

  revalidatePath("/[locale]/cart", "page");
  return null;
}

export async function removeCartItemAction(
  _prev: CartMutationState,
  formData: FormData,
): Promise<CartMutationState> {
  const productId = productIdSchema.safeParse(formData.get("productId"));
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!productId.success || !locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await removeCartItem(token, productId.data);
  } catch (error) {
    return handleCartError(error, locale.data);
  }

  revalidatePath("/[locale]/cart", "page");
  return null;
}

export async function clearCartAction(
  _prev: CartMutationState,
  formData: FormData,
): Promise<CartMutationState> {
  const locale = localeSchema.safeParse(formData.get("locale"));

  if (!locale.success) {
    return { error: true };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  try {
    await clearCart(token);
  } catch (error) {
    return handleCartError(error, locale.data);
  }

  revalidatePath("/[locale]/cart", "page");
  return null;
}
