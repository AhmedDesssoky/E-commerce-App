import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const CART_URL = `${ROUTE_ORIGIN}/api/v2/cart`;

const cartProductSchema = z.object({
  _id: z.string(),
  product: z.object({
    _id: z.string(),
    title: z.string(),
    imageCover: z.string(),
    category: z.object({ name: z.string() }).optional(),
    brand: z.object({ name: z.string() }).optional(),
  }),
  count: z.number(),
  price: z.number(),
});

const cartDataSchema = z.object({
  _id: z.string(),
  products: z.array(cartProductSchema),
  totalCartPrice: z.number(),
});

const cartResponseSchema = z.object({
  status: z.string(),
  numOfCartItems: z.number(),
  data: cartDataSchema,
});

const cartAddSchema = z.object({
  status: z.literal("success"),
});

export type CartProduct = z.infer<typeof cartProductSchema>;
export type CartData = z.infer<typeof cartDataSchema>;

async function cartFetch(
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
    throw new RouteApiError("/cart", response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new RouteApiError("/cart", response.status);
  }
}

export async function addCartItem(token: string, productId: string) {
  const payload = await cartFetch(CART_URL, token, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

  if (!cartAddSchema.safeParse(payload).success) {
    throw new RouteApiError("/cart", 500);
  }
}

export async function getCart(token: string): Promise<CartData | null> {
  const payload = await cartFetch(CART_URL, token);
  const parsed = cartResponseSchema.safeParse(payload);

  if (!parsed.success) return null;
  return parsed.data.data;
}

export async function getCartCount(token: string): Promise<number> {
  const payload = await cartFetch(CART_URL, token);
  const parsed = cartResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/cart", 500);
  }

  return parsed.data.numOfCartItems;
}

export async function updateCartItem(
  token: string,
  productId: string,
  count: number,
) {
  await cartFetch(`${CART_URL}/${productId}`, token, {
    method: "PUT",
    body: JSON.stringify({ count }),
  });
}

export async function removeCartItem(token: string, productId: string) {
  await cartFetch(`${CART_URL}/${productId}`, token, {
    method: "DELETE",
  });
}

export async function clearCart(token: string) {
  await fetch(CART_URL, {
    method: "DELETE",
    headers: { token },
    cache: "no-store",
  });
}
