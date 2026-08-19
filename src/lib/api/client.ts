import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const ROUTE_API_BASE = `${ROUTE_ORIGIN}/api/v1`;
const CATALOG_REVALIDATE_SECONDS = 3600;

type QueryValue = string | number | undefined;

/** Public catalog GETs only. Do not use for token/cart/auth requests. */
export async function routeCatalogGet(
  path: string,
  query?: Record<string, QueryValue>,
) {
  const url = new URL(`${ROUTE_API_BASE}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new RouteApiError(path, response.status);
  }

  return response.json();
}
