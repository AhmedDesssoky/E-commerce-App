---
name: route-ecommerce-api
description: >-
  Integrate the public Route E-commerce REST API (ecommerce.routemisr.com) from
  this Next.js storefront. Use when adding or changing auth, products, categories,
  brands, cart, wishlist, addresses, coupons, orders, or checkout; when the user
  says "route api", "FreshCart API", "ecommerce.routemisr", or mentions Postman
  collection 5709532. Do not invent endpoints — follow endpoints.md.
---

# Route E-commerce API

Backend is **Route API only**. This app does not own a product database.

- Base: `https://ecommerce.routemisr.com/api/v1`
- Cart writes: `https://ecommerce.routemisr.com/api/v2/cart` (v2 populated responses)
- Docs: https://ecommerce.routemisr.com/ · https://documenter.getpostman.com/view/5709532/2s93JqTRWN

Read [endpoints.md](endpoints.md) before adding a call. If an endpoint is missing there, fetch the Postman/docs page — do not guess.

## Client rules

1. All Route HTTP lives in `lib/api/` (one module per resource: `auth`, `products`, `cart`, …).
2. Server Actions / Route Handlers call `lib/api`. Client Components call Actions or a thin query hook — never raw `fetch` to Route.
3. Authenticated requests send header **`token: <jwt>`** (not `Authorization: Bearer`).
4. JWT stays in an httpOnly cookie. The API layer reads it on the server.
5. Type responses with Zod (or generated types). Typical list envelope:

```ts
{ results: number; metadata?: { currentPage: number; numberOfPages: number; limit: number }; data: T[] }
```

6. Public GETs (products, categories, brands) may use Next `fetch` cache + `revalidate`. **Never** cache cart, wishlist, addresses, or orders as public.
7. Query params for products: `limit`, `page`, `sort`, `keyword`, `price[gte]`, `price[lte]`, `category`, `brand`.

## Auth flow

- Signup / signin → persist JWT cookie → redirect to an allowlisted internal path.
- Forgot password: `forgotPasswords` → `verifyResetCode` → `resetPassword` (three steps, do not skip).
- 401 from Route → clear cookie, redirect to sign-in. Do not retry infinitely.

## Cart / checkout

- Empty cart cannot checkout. Quantity must be ≥ 1.
- Cash order vs Stripe checkout-session are **different** endpoints. Do not mix payloads.
- After successful order, invalidate cart UI state.

## Errors

Map `statusMsg` / `message` / `errors` to next-intl keys. Log `status` + endpoint name, never the token.

## MCP

Refresh docs with Context7 only for **Next.js**. For Route itself, use Firecrawl/WebFetch on the URLs above when endpoints.md is stale.
