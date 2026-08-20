import { getTranslations } from "next-intl/server";
import { BrandMark } from "@/components/brand-mark";
import { CartIcon, HeartIcon } from "@/components/nav-icons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { SignOutButton } from "@/components/sign-out-button";
import { shopLinks, authLinks } from "@/components/site-links";
import { getCartCount } from "@/lib/api/cart";
import { getWishlistCount } from "@/lib/api/wishlist";
import { RouteApiError } from "@/lib/api/route-error";
import { getRouteToken } from "@/lib/auth/session";

export async function Navbar() {
  const t = await getTranslations("common");
  const token = await getRouteToken();
  const isLoggedIn = token !== null;
  let cartCount = 0;
  let wishlistCount = 0;

  if (token) {
    const [cartResult, wishlistResult] = await Promise.allSettled([
      getCartCount(token),
      getWishlistCount(token),
    ]);

    if (cartResult.status === "fulfilled") {
      cartCount = cartResult.value;
    } else if (!(cartResult.reason instanceof RouteApiError)) {
      throw cartResult.reason;
    }

    if (wishlistResult.status === "fulfilled") {
      wishlistCount = wishlistResult.value;
    } else if (!(wishlistResult.reason instanceof RouteApiError)) {
      throw wishlistResult.reason;
    }
  }

  function countLabel(value: number) {
    return value > 99 ? "99+" : String(value);
  }

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bone">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-10 focus:rounded-sm focus:bg-bone focus:px-3 focus:py-2 focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-16 w-full max-w-[var(--token-measure-content)] items-center gap-6 px-[var(--token-gutter)]">
        <BrandMark alt={t("brand")} preload />

        <nav aria-label={t("nav.primary")} className="hidden flex-1 md:flex">
          <ul className="flex items-center gap-6">
            {shopLinks.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{t(`nav.${item.key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <LocaleSwitcher />
          {isLoggedIn ? (
            <>
              <NavLink href="/account">{t("nav.account")}</NavLink>
              <NavLink href="/orders">{t("nav.orders")}</NavLink>
              <NavLink href="/addresses">{t("nav.addresses")}</NavLink>
              <NavLink href="/wishlist">
                <span className="inline-flex items-center gap-2">
                  <HeartIcon />
                  {t("nav.wishlist")}
                  {wishlistCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sale px-1.5 py-0.5 text-[10px] font-semibold leading-none text-bone tabular-nums">
                      {countLabel(wishlistCount)}
                    </span>
                  ) : null}
                </span>
              </NavLink>
              <NavLink href="/cart">
                <span className="inline-flex items-center gap-2">
                  <CartIcon />
                  {t("nav.cart")}
                  {cartCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sale px-1.5 py-0.5 text-[10px] font-semibold leading-none text-bone tabular-nums">
                      {countLabel(cartCount)}
                    </span>
                  ) : null}
                </span>
              </NavLink>
              <SignOutButton />
            </>
          ) : (
            <>
              {authLinks.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {t(`nav.${item.key}`)}
                </NavLink>
              ))}
            </>
          )}
        </div>

        <MobileNav
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />
      </div>
    </header>
  );
}
