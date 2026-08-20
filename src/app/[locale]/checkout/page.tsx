import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getAddresses } from "@/lib/api/addresses";
import { getCart } from "@/lib/api/cart";
import { RouteApiError } from "@/lib/api/route-error";
import {
  clearRouteToken,
  getDefaultAddressId,
  getRouteToken,
} from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.checkout");
  return { title: t("title") };
}

export default async function CheckoutPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({
      href: { pathname: "/sign-in", query: { next: "/checkout" } },
      locale,
    });
    return null;
  }

  let cart;
  let addresses: Awaited<ReturnType<typeof getAddresses>> = [];

  try {
    cart = await getCart(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({
        href: { pathname: "/sign-in", query: { next: "/checkout" } },
        locale,
      });
      return null;
    }

    return (
      <CheckoutShell title={t("checkout.title")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("checkout.unavailable")}
        </p>
      </CheckoutShell>
    );
  }

  if (!cart || cart.products.length === 0) {
    redirect({ href: "/cart", locale });
    return null;
  }

  try {
    addresses = await getAddresses(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({
        href: { pathname: "/sign-in", query: { next: "/checkout" } },
        locale,
      });
      return null;
    }

    if (!(error instanceof RouteApiError)) {
      throw error;
    }
  }

  const defaultAddressId = await getDefaultAddressId();
  const orderedAddresses = [...addresses].sort((a, b) => {
    if (a._id === defaultAddressId) return -1;
    if (b._id === defaultAddressId) return 1;
    return 0;
  });

  const format = await getFormatter();

  function money(value: number) {
    return format.number(value, { style: "currency", currency: "EGP" });
  }

  return (
    <CheckoutShell title={t("checkout.title")}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-line bg-paper p-5 shadow-sm">
          <h2 className="mb-4 text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
            {t("checkout.shippingAddress")}
          </h2>
          <CheckoutForm addresses={orderedAddresses} />
        </section>

        <aside className="rounded-lg border border-line bg-paper p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
            {t("checkout.summary")}
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {cart.products.map((item) => (
              <li
                key={item._id}
                className="flex items-start justify-between gap-3 py-3 text-[length:var(--token-label-size)] leading-[var(--token-label-line)]"
              >
                <span className="min-w-0 text-mute">
                  <span className="line-clamp-2 text-ink">{item.product.title}</span>
                  <span className="mt-0.5 block tabular-nums">
                    × {item.count}
                  </span>
                </span>
                <span className="shrink-0 font-medium tabular-nums text-ink">
                  {money(item.price * item.count)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
              {t("cart.total")}
            </span>
            <span className="text-[length:var(--token-price-size)] font-semibold tabular-nums text-ink">
              {money(cart.totalCartPrice)}
            </span>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-flex text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute underline-offset-4 hover:text-ink hover:underline"
          >
            {t("checkout.backToCart")}
          </Link>
        </aside>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {title}
      </h1>
      <div className="mt-10">{children}</div>
    </div>
  );
}
