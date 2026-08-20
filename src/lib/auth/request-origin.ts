import { headers } from "next/headers";

/** Prefer `SITE_URL` so Stripe return URLs never trust a spoofed Host header. */
export function originFromSiteUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function originFromHostHeader(host: string | null, protoHeader: string | null) {
  if (!host || host.includes(",") || host.includes("://") || host.includes("\\")) {
    return null;
  }

  const proto =
    protoHeader === "https" || protoHeader === "http"
      ? protoHeader
      : process.env.NODE_ENV === "production"
        ? "https"
        : "http";

  return `${proto}://${host}`;
}

/** Build the storefront origin for Route Stripe `url` (server-only). */
export async function getRequestOrigin() {
  const configured = originFromSiteUrl(process.env.SITE_URL);
  if (configured) {
    return configured;
  }

  // Production must set SITE_URL — do not trust request Host.
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const h = await headers();
  return originFromHostHeader(
    h.get("x-forwarded-host") ?? h.get("host"),
    h.get("x-forwarded-proto"),
  );
}
