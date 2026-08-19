import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/brand-mark";
import { SignOutButton } from "@/components/sign-out-button";
import { authLinks, shopLinks, type AppPath } from "@/components/site-links";
import { getRouteToken } from "@/lib/auth/session";



function FooterLink({
  href,
  children,
}: {
  href: AppPath;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
    >
      {children}
    </Link>
  );
}

export async function Footer() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();
  const token = await getRouteToken();
  const isLoggedIn = token !== null;

  return (
    <footer className="mt-auto border-t border-line bg-bone">
      <div className="mx-auto flex w-full max-w-[var(--token-measure-content)] flex-col gap-10 px-[var(--token-gutter)] py-12 md:flex-row md:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <BrandMark alt={t("brand")} />
          <p className="text-mute text-[length:var(--token-body-size)] leading-[var(--token-body-line)]">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <nav aria-labelledby="footer-shop-heading" className="flex flex-col gap-3">
            <h2
              id="footer-shop-heading"
              className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink"
            >
              {t("footer.shop")}
            </h2>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{t(`nav.${item.key}`)}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-4 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
