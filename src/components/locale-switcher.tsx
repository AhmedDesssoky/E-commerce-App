"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useParams, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

function localeSwitchHref(
  pathname: ReturnType<typeof usePathname>,
  params: ReturnType<typeof useParams>,
) {
  if (pathname === "/products/[id]") {
    const id = typeof params.id === "string" ? params.id : undefined;
    if (!id) {
      return "/products" as const;
    }
    return { pathname: "/products/[id]" as const, params: { id } };
  }

  if (pathname === "/brands/[id]") {
    const id = typeof params.id === "string" ? params.id : undefined;
    if (!id) {
      return "/brands" as const;
    }
    return { pathname: "/brands/[id]" as const, params: { id } };
  }

  if (pathname === "/categories/[id]") {
    const id = typeof params.id === "string" ? params.id : undefined;
    if (!id) {
      return "/categories" as const;
    }
    return { pathname: "/categories/[id]" as const, params: { id } };
  }

  return pathname;
}

export function LocaleSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("common.locale");
  const href = localeSwitchHref(pathname, params);

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-sm border border-line bg-paper p-0.5"
    >
      {routing.locales.map((code) => {
        const selected = code === locale;
        const shortLabel = code === "en" ? t("enCode") : t("arCode");
        const name = t(code);
        const className = `inline-flex min-h-7 min-w-9 items-center justify-center rounded-[6px] px-2.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
          selected ? "bg-ink text-bone" : "text-mute hover:text-ink"
        }`;

        if (selected) {
          return (
            <span
              key={code}
              aria-current="true"
              aria-label={name}
              className={className}
            >
              {shortLabel}
            </span>
          );
        }

        return (
          <Link
            key={code}
            href={href}
            locale={code}
            onClick={onNavigate}
            aria-label={name}
            className={className}
          >
            {shortLabel}
          </Link>
        );
      })}
    </div>
  );
}
