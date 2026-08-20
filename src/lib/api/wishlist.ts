import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const WISHLIST_URL = `${ROUTE_ORIGIN}/api/v1/wishlist`;

const wishlistProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  imageCover: z.string(),
  price: z.number(),
  category: z.object({ name: z.string() }).optional(),
  brand: z.object({ name: z.string() }).optional(),
});

const wishlistResponseSchema = z.object({
  status: z.string(),
  count: z.number().optional(),
  data: z.array(wishlistProductSchema),
});

export type WishlistProduct = z.infer<typeof wishlistProductSchema>;

async function wishlistFetch(
  url: string,
  token: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      token,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new RouteApiError("/wishlist", response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new RouteApiError("/wishlist", response.status);
  }
}

export async function getWishlist(token: string): Promise<WishlistProduct[]> {
  const payload = await wishlistFetch(WISHLIST_URL, token);
  const parsed = wishlistResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/wishlist", 500);
  }

  return parsed.data.data;
}

export async function getWishlistCount(token: string): Promise<number> {
  const payload = await wishlistFetch(WISHLIST_URL, token);
  const parsed = wishlistResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/wishlist", 500);
  }

  return parsed.data.count ?? parsed.data.data.length;
}

export async function addWishlistItem(token: string, productId: string) {
  await wishlistFetch(WISHLIST_URL, token, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function removeWishlistItem(token: string, productId: string) {
  await wishlistFetch(`${WISHLIST_URL}/${productId}`, token, {
    method: "DELETE",
  });
}
