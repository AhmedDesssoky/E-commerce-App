import { routing } from "@/i18n/routing";

export type AppPath = Exclude<
  keyof typeof routing.pathnames,
  | "/products/[id]"
  | "/brands/[id]"
  | "/categories/[id]"
  | "/checkout/success"
  | "/allorders"
>;

export const shopLinks = [
  { href: "/" as const, key: "home" as const },
  { href: "/products" as const, key: "products" as const },
  { href: "/categories" as const, key: "categories" as const },
  { href: "/brands" as const, key: "brands" as const },
];

export const authLinks = [
  { href: "/sign-in" as const, key: "signIn" as const },
  { href: "/sign-up" as const, key: "signUp" as const },
];
