import { getTranslations } from "next-intl/server";
import { BrandMark } from "@/components/brand-mark";
import { CartIcon } from "@/components/nav-icons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { SignOutButton } from "@/components/sign-out-button";
import { shopLinks, authLinks } from "@/components/site-links";
import { getRouteToken } from "@/lib/auth/session";

export async function Navbar() {
  const t = await getTranslations("common");
  const token = await getRouteToken();
  const isLoggedIn = token !== null;

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
          <LocaleSwitcher />
          {isLoggedIn ? (
            <>
              <NavLink href="/cart">
                <span className="inline-flex items-center gap-2">
                  <CartIcon />
                  {t("nav.cart")}
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

        <MobileNav isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
