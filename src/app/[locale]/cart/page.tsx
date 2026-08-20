import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { CartItem } from "@/components/cart-item";
import { ClearCartButton } from "@/components/clear-cart-button";
import { getCart } from "@/lib/api/cart";
import { RouteApiError } from "@/lib/api/route-error";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("cart") };
}

export default async function CartPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({ href: "/sign-in", locale });
    return null;
  }

  let cart;

  try {
    cart = await getCart(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({ href: "/sign-in", locale });
      return null;
    }

    return (
      <CartShell title={t("nav.cart")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("cart.unavailable")}
        </p>
      </CartShell>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <CartShell title={t("nav.cart")}>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
            {t("cart.empty")}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
          >
            {t("cart.emptyAction")}
          </Link>
        </div>
      </CartShell>
    );
  }

  const format = await getFormatter();

  function money(value: number) {
    return format.number(value, { style: "currency", currency: "EGP" });
  }

  return (
    <CartShell title={t("nav.cart")}>
      <div className="flex flex-col gap-0 lg:flex-row lg:gap-12">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
              {cart.products.length} {cart.products.length === 1 ? "item" : "items"}
            </p>
            <ClearCartButton />
          </div>

          <div className="divide-y divide-line">
            {cart.products.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:w-80">
          <div className="sticky top-24 rounded-md border border-line bg-paper p-6">
            <h2 className="text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
              {t("cart.total")}
            </h2>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
                {t("cart.total")}
              </span>
              <span className="text-[length:var(--token-price-size)] font-semibold tabular-nums text-ink">
                {money(cart.totalCartPrice)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
            >
              {t("cart.checkout")}
            </Link>
            <Link
              href="/products"
              className="mt-3 flex w-full items-center justify-center rounded-sm border border-line px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-line"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </CartShell>
  );
}

function CartShell({
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
