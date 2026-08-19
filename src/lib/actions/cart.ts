"use server";

import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { addCartItem } from "@/lib/api/cart";
import { productIdSchema } from "@/lib/api/catalog";
import { RouteApiError } from "@/lib/api/route-error";
import { parseInternalPath } from "@/lib/auth/return-path";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export type AddToCartState = { error: true } | null;

const localeSchema = z.enum(routing.locales);

function redirectToSignIn(
  locale: z.infer<typeof localeSchema>,
  productId: string,
) {
  const next = parseInternalPath(`/products/${productId}`);

  redirect({
    href: next
      ? { pathname: "/sign-in", query: { next } }
      : "/sign-in",
    locale,
  });
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

  const token = await getRouteToken();

  if (!token) {
    redirectToSignIn(locale.data, parsed.data);
    return null;
  }

  try {
    await addCartItem(token, parsed.data);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirectToSignIn(locale.data, parsed.data);
      return null;
    }

    if (error instanceof RouteApiError) {
      console.error(`cart ${error.status}`);
      return { error: true };
    }

    throw error;
  }

  redirect({ href: "/cart", locale: locale.data });
  return null;
}
