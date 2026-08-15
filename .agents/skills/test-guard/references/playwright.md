# Test Guard — Playwright (this storefront)

Read this when adding or reviewing `e2e/` / `tests/*.spec.ts` Playwright files.

## What to cover

Shopper-observable flows only:

- Catalog browse / search / filter
- Auth (signin, signup validation, logout)
- Cart add / update qty / remove (authenticated)
- Checkout happy path (cash) — mock or sandbox Stripe; do not hit live payment
- i18n: one smoke that `ar` layout is `dir="rtl"` and a glossary string appears

## Rules mapped

- **Rule 2:** Mock Route API with MSW or Playwright `page.route`. Do not mock React components to "unit test" a page.
- **Rule 4:** One e2e per flow. Do not duplicate the same add-to-cart spec for every category.
- **Rule 7:** Do not assert Next.js 404 page chrome or Playwright locator engine behavior.
- **Rule 1:** Assert UI + network outcome (cart count, order confirmation), not internal Action function names.

## Anti-patterns

- Logging in via `localStorage.setItem('token', …)` — the app uses httpOnly cookies; use the real signin form or a test-only cookie helper.
- Hitting production `ecommerce.routemisr.com` from CI without a skip/flag — prefer MSW fixtures for PR runs; optional live smoke on demand.
