import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const CART_URL = `${ROUTE_ORIGIN}/api/v2/cart`;

const cartAddSchema = z.object({
  status: z.literal("success"),
});

export async function addCartItem(token: string, productId: string) {
  const response = await fetch(CART_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ productId }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new RouteApiError("/cart", response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new RouteApiError("/cart", response.status);
  }

  if (!cartAddSchema.safeParse(payload).success) {
    throw new RouteApiError("/cart", response.status);
  }
}
