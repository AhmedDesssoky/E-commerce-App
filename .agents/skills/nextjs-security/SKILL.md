---
name: nextjs-security
description: >-
  Security review for this Next.js + Route API storefront: JWT cookies, XSS,
  CSRF/SameSite, open redirects, authz on cart/checkout, secret leakage. Use when
  the user says "security audit", "laravel security", "audit security", or when
  the change touches auth, cookies, payments, uploads, or public writes.
---

# Next.js storefront security

Run this on any diff that touches auth, cookies, cart, wishlist, addresses, orders, or checkout.

## Must-haves

1. **JWT storage** — httpOnly + `Secure` (prod) + `SameSite=Lax` (or Strict). Not `localStorage` / `sessionStorage` / world-readable cookies.
2. **Token header** — only server code sends `token`. Never put JWT in a Client Component, URL, or log.
3. **Authz** — every cart/wishlist/address/order Action re-reads the cookie. Do not trust a client-sent `userId` for `/orders/user/:userId` — use the id from the verified session.
4. **Open redirect** — post-login `callbackUrl` must be a same-origin relative path.
5. **XSS** — no `dangerouslySetInnerHTML` on API/user strings (product descriptions included unless sanitized upstream).
6. **CSRF** — cookie SameSite + origin checks on mutations. Next Server Actions already bind to the app origin; do not add a public GET that mutates.
7. **Secrets** — `.env` only. No tokens in git, README, or client bundles.
8. **Stripe return URL** — allowlist our origin only when passing `url` to checkout-session.
9. **Rate / replay** — password reset codes are sensitive; do not echo them in the UI after submit.
10. **Uploads** — this API does not take storefront file uploads. Do not add arbitrary file POST to Route.

## Severity

| Issue | Severity |
|-------|----------|
| JWT in localStorage or client bundle | Critical |
| Unauthenticated cart/order write | Critical |
| `dangerouslySetInnerHTML` on product/user HTML | Critical |
| Open redirect | High |
| Logging token / password | High |
| Missing Zod on mutation | Medium |
| Over-broad CORS if we add Route Handlers | High |

## Output

Problem, why, fix, severity. Do not write exploit PoCs.
