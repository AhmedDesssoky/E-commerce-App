"use server";

import { revalidatePath } from "next/cache";
import { redirect as nextRedirect } from "next/navigation";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAddresses } from "@/lib/api/addresses";
import { getCart } from "@/lib/api/cart";
import {
  createCashOrder,
  createCheckoutSession,
} from "@/lib/api/orders";
import { RouteApiError } from "@/lib/api/route-error";
import { getRequestOrigin } from "@/lib/auth/request-origin";
import { parseInternalPath } from "@/lib/auth/return-path";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export type CheckoutState =
  | {
      error: "invalid" | "empty" | "failed" | "noAddress";
      fieldErrors?: Partial<
        Record<"details" | "phone" | "city", "details" | "phone" | "city">
      >;
    }
  | null;

const localeSchema = z.enum(routing.locales);
const paymentMethodSchema = z.enum(["cash", "card"]);
const addressIdSchema = z.string().min(1);
const shippingInputSchema = z.object({
  details: z.string().trim().min(5),
  phone: z.string().trim().min(6),
  city: z.string().trim().min(2),
});

function mapShippingFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<
    Record<"details" | "phone" | "city", "details" | "phone" | "city">
  > = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "details" || field === "phone" || field === "city") {
      fieldErrors[field] = field;
    }
  }

  return fieldErrors;
}

function redirectToSignIn(locale: z.infer<typeof localeSchema>) {
  const next = parseInternalPath("/checkout");

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

async function resolveShipping(
  token: string,
  formData: FormData,
  locale: z.infer<typeof localeSchema>,
): Promise<
  | { ok: true; shipping: z.infer<typeof shippingInputSchema> }
  | { ok: false; state: CheckoutState }
> {
  const addressId = addressIdSchema.safeParse(formData.get("addressId"));

  if (addressId.success) {
    try {
      const addresses = await getAddresses(token);
      const selected = addresses.find((address) => address._id === addressId.data);

      if (!selected) {
        return { ok: false, state: { error: "noAddress" } };
      }

      return {
        ok: true,
        shipping: {
          details: selected.details,
          phone: selected.phone,
          city: selected.city,
        },
      };
    } catch (error) {
      if (error instanceof RouteApiError && error.status === 401) {
        await clearRouteToken();
        redirectToSignIn(locale);
        return { ok: false, state: null };
      }

      if (error instanceof RouteApiError) {
        console.error(`checkout addresses ${error.status}`);
        return { ok: false, state: { error: "failed" } };
      }

      throw error;
    }
  }

  const input = shippingInputSchema.safeParse({
    details: formData.get("details"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  });

  if (!input.success) {
    return {
      ok: false,
      state: {
        error: "invalid",
        fieldErrors: mapShippingFieldErrors(input.error),
      },
    };
  }

  return { ok: true, shipping: input.data };
}

function revalidateCheckoutSurfaces() {
  revalidatePath("/[locale]/cart", "page");
  revalidatePath("/[locale]/checkout", "page");
  revalidatePath("/[locale]/orders", "page");
  revalidatePath("/[locale]/allorders", "page");
}

export async function checkoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const locale = localeSchema.safeParse(formData.get("locale"));
  const paymentMethod = paymentMethodSchema.safeParse(
    formData.get("paymentMethod"),
  );

  if (!locale.success || !paymentMethod.success) {
    return { error: "invalid" };
  }

  const token = await requireToken(locale.data);
  if (!token) return null;

  let cart;

  try {
    cart = await getCart(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirectToSignIn(locale.data);
      return null;
    }

    if (error instanceof RouteApiError) {
      console.error(`checkout cart ${error.status}`);
      return { error: "failed" };
    }

    throw error;
  }

  if (!cart || cart.products.length === 0) {
    return { error: "empty" };
  }

  const shippingResult = await resolveShipping(token, formData, locale.data);
  if (!shippingResult.ok) {
    return shippingResult.state;
  }

  if (paymentMethod.data === "cash") {
    try {
      await createCashOrder(token, cart._id, shippingResult.shipping);
    } catch (error) {
      if (error instanceof RouteApiError && error.status === 401) {
        await clearRouteToken();
        redirectToSignIn(locale.data);
        return null;
      }

      if (error instanceof RouteApiError) {
        console.error(`checkout cash ${error.status}`);
        return { error: "failed" };
      }

      throw error;
    }

    revalidateCheckoutSurfaces();
    redirect({ href: "/checkout/success", locale: locale.data });
    return null;
  }

  const origin = await getRequestOrigin();
  if (!origin) {
    return { error: "failed" };
  }

  // Route appends `/allorders` to this base after Stripe payment.
  const returnBase = `${origin}/${locale.data}`;

  let stripeUrl: string;

  try {
    stripeUrl = await createCheckoutSession(
      token,
      cart._id,
      shippingResult.shipping,
      returnBase,
    );
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirectToSignIn(locale.data);
      return null;
    }

    if (error instanceof RouteApiError) {
      console.error(`checkout session ${error.status}`);
      return { error: "failed" };
    }

    throw error;
  }

  revalidateCheckoutSurfaces();
  nextRedirect(stripeUrl);
  return null;
}
