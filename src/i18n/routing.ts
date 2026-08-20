import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/categories": "/categories",
    "/categories/[id]": "/categories/[id]",
    "/brands": "/brands",
    "/brands/[id]": "/brands/[id]",
    "/cart": "/cart",
    "/checkout": "/checkout",
    "/checkout/success": "/checkout/success",
    "/allorders": "/allorders",
    "/wishlist": "/wishlist",
    "/addresses": "/addresses",
    "/account": "/account",
    "/orders": "/orders",
    "/sign-in": "/sign-in",
    "/sign-up": "/sign-up",
    "/products/[id]": "/products/[id]",
  },
});
