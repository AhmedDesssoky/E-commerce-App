const STATIC_PATHS = new Set([
  "/",
  "/products",
  "/categories",
  "/brands",
  "/cart",
]);

const PRODUCT_PATH = /^\/products\/[a-f0-9]{24}$/i;

export function parseInternalPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 200) {
    return null;
  }

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("://") ||
    value.includes("%")
  ) {
    return null;
  }

  const path = value.split("?")[0].split("#")[0];

  if (STATIC_PATHS.has(path) || PRODUCT_PATH.test(path)) {
    return path;
  }

  return null;
}

export function parseNextParam(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return parseInternalPath(value);
  }

  if (Array.isArray(value)) {
    return parseInternalPath(value[0]);
  }

  return null;
}

export type InternalHref =
  | "/"
  | "/products"
  | "/categories"
  | "/brands"
  | "/cart"
  | { pathname: "/products/[id]"; params: { id: string } };

export function hrefFromInternalPath(value: unknown): InternalHref {
  const path = parseInternalPath(value) ?? "/";

  switch (path) {
    case "/":
    case "/products":
    case "/categories":
    case "/brands":
    case "/cart":
      return path;
    default:
      return {
        pathname: "/products/[id]",
        params: { id: path.slice("/products/".length) },
      };
  }
}
