import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";
import { isStripeCheckoutUrl } from "@/lib/api/stripe-checkout-url";

const ORDERS_URL = `${ROUTE_ORIGIN}/api/v1/orders`;

const shippingAddressSchema = z.object({
  details: z.string().min(1),
  phone: z.string().min(1),
  city: z.string().min(1),
});

const cashOrderResponseSchema = z.object({
  status: z.string(),
});

const checkoutSessionResponseSchema = z.object({
  status: z.string(),
  session: z.object({
    url: z.string().url(),
  }),
});

const orderProductSchema = z.object({
  _id: z.string(),
  title: z.string().optional(),
  imageCover: z.string().optional(),
});

const orderCartItemSchema = z.object({
  _id: z.string(),
  count: z.number(),
  price: z.number(),
  product: orderProductSchema.or(z.string()),
});

const orderSchema = z.object({
  _id: z.string(),
  shippingAddress: shippingAddressSchema.optional(),
  totalOrderPrice: z.number(),
  paymentMethodType: z.string().optional(),
  isPaid: z.boolean().optional(),
  isDelivered: z.boolean().optional(),
  createdAt: z.string().optional(),
  cartItems: z.array(z.unknown()).optional(),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type Order = {
  _id: string;
  shippingAddress?: ShippingAddress;
  totalOrderPrice: number;
  paymentMethodType?: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt?: string;
  cartItems: Array<{
    _id: string;
    count: number;
    price: number;
    title: string;
    imageCover?: string;
  }>;
};

async function ordersFetch(
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

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new RouteApiError("/orders", response.status);
  }

  if (!response.ok) {
    throw new RouteApiError("/orders", response.status);
  }

  return payload;
}

function parseOrderRows(rows: unknown[]): Order[] {
  const orders: Order[] = [];

  for (const row of rows) {
    const parsed = orderSchema.safeParse(row);
    if (!parsed.success) {
      continue;
    }

    const cartItems: Order["cartItems"] = [];

    for (const item of parsed.data.cartItems ?? []) {
      const line = orderCartItemSchema.safeParse(item);
      if (!line.success) {
        continue;
      }

      const product = line.data.product;
      const title =
        typeof product === "string"
          ? product
          : (product.title ?? product._id);
      const imageCover =
        typeof product === "string" ? undefined : product.imageCover;

      cartItems.push({
        _id: line.data._id,
        count: line.data.count,
        price: line.data.price,
        title,
        imageCover,
      });
    }

    orders.push({
      _id: parsed.data._id,
      shippingAddress: parsed.data.shippingAddress,
      totalOrderPrice: parsed.data.totalOrderPrice,
      paymentMethodType: parsed.data.paymentMethodType,
      isPaid: parsed.data.isPaid ?? false,
      isDelivered: parsed.data.isDelivered ?? false,
      createdAt: parsed.data.createdAt,
      cartItems,
    });
  }

  return orders;
}

export async function createCashOrder(
  token: string,
  cartId: string,
  shippingAddress: ShippingAddress,
) {
  const safeAddress = shippingAddressSchema.parse(shippingAddress);
  const payload = await ordersFetch(`${ORDERS_URL}/${cartId}`, token, {
    method: "POST",
    body: JSON.stringify({ shippingAddress: safeAddress }),
  });

  if (!cashOrderResponseSchema.safeParse(payload).success) {
    throw new RouteApiError("/orders", 500);
  }
}

export { isStripeCheckoutUrl } from "@/lib/api/stripe-checkout-url";

export async function createCheckoutSession(
  token: string,
  cartId: string,
  shippingAddress: ShippingAddress,
  returnUrl: string,
) {
  const safeAddress = shippingAddressSchema.parse(shippingAddress);
  const endpoint = `${ORDERS_URL}/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`;
  const payload = await ordersFetch(endpoint, token, {
    method: "POST",
    body: JSON.stringify({ shippingAddress: safeAddress }),
  });

  const parsed = checkoutSessionResponseSchema.safeParse(payload);

  if (!parsed.success || !isStripeCheckoutUrl(parsed.data.session.url)) {
    throw new RouteApiError("/orders/checkout-session", 500);
  }

  return parsed.data.session.url;
}

export async function getUserOrders(
  token: string,
  userId: string,
): Promise<Order[]> {
  const payload = await ordersFetch(`${ORDERS_URL}/user/${userId}`, token);

  if (Array.isArray(payload)) {
    return sortOrdersNewestFirst(parseOrderRows(payload));
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray(payload.data)
  ) {
    return sortOrdersNewestFirst(parseOrderRows(payload.data));
  }

  throw new RouteApiError("/orders/user", 500);
}

function sortOrdersNewestFirst(orders: Order[]) {
  return [...orders].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
}
