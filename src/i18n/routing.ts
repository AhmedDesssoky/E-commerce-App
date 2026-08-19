import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/categories": "/categories",
    "/brands": "/brands",
    "/cart": "/cart",
    "/sign-in": "/sign-in",
    "/sign-up": "/sign-up",
    "/products/[id]": "/products/[id]",
  },
});
