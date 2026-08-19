import type { InternalHref } from "@/lib/auth/return-path";

export type AuthFlash = "signed-in" | "signed-up";

export function parseAuthFlash(value: unknown): AuthFlash | null {
  if (value === "signed-in" || value === "signed-up") {
    return value;
  }

  return null;
}

export function hrefWithAuthFlash(href: InternalHref, flash: AuthFlash) {
  if (typeof href === "string") {
    return { pathname: href, query: { auth: flash } } as const;
  }

  return { ...href, query: { auth: flash } };
}
