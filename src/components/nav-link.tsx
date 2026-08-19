"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPath } from "@/components/site-links";

function isActivePath(pathname: string, href: AppPath) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  children,
  onNavigate,
}: {
  href: AppPath;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`relative inline-flex items-center rounded-sm py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
        active ? "text-ink" : "text-mute hover:text-ink"
      }`}
    >
      {children}
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-px bg-ink"
        />
      ) : null}
    </Link>
  );
}
