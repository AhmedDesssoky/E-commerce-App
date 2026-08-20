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

/** Vercel sets host-only values (`*.vercel.app`); always use https. */
export function originFromVercelHost(value: string | undefined) {
  if (!value) return null;

  const host = value.trim().replace(/^https?:\/\//i, "").split("/")[0];
  if (
    !host ||
    host.includes(",") ||
    host.includes("://") ||
    host.includes("\\") ||
    host.includes(" ")
  ) {
    return null;
  }

  return `https://${host}`;
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

  // Platform-provided hosts are trusted (not client Host headers).
  const vercel =
    originFromVercelHost(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    originFromVercelHost(process.env.VERCEL_URL);
  if (vercel) {
    return vercel;
  }

  // Local / non-Vercel production without SITE_URL: refuse Host spoofing.
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const h = await headers();
  return originFromHostHeader(
    h.get("x-forwarded-host") ?? h.get("host"),
    h.get("x-forwarded-proto"),
  );
}
