# Route API endpoints

Base: `https://ecommerce.routemisr.com/api/v1`  
Auth: header `token` on every non-public route.

## Auth (public)

| Method | Path | Body / notes |
|--------|------|----------------|
| POST | `/auth/signup` | `name`, `email`, `password`, `rePassword`, `phone` |
| POST | `/auth/signin` | `email`, `password` → `{ token, user }` |
| POST | `/auth/forgotPasswords` | `email` |
| POST | `/auth/verifyResetCode` | `resetCode` |
| PUT | `/auth/resetPassword` | `email`, `newPassword` |
| PUT | `/auth/changeMyPassword` | `currentPassword`, `password`, `rePassword` (token) |
| PUT | `/users/updateMe/` | `name`, `email`, `phone` (token) |
| GET | `/auth/verifyToken` | token |

## Catalog (public GET)

| Method | Path |
|--------|------|
| GET | `/categories` |
| GET | `/categories/:id` |
| GET | `/categories/:id/subcategories` |
| GET | `/subcategories` |
| GET | `/subcategories/:id` |
| GET | `/brands` |
| GET | `/brands/:id` |
| GET | `/products` |
| GET | `/products/:id` |

Product list query: `limit`, `page`, `sort` (`-price`, `price`, `-sold`, …), `keyword`, `price[gte]`, `price[lte]`, `category`, `brand`.

## Cart (token) — prefer v2

Use `/api/v2/cart` for these. Legacy `/api/v1/cart` exists; do not mix versions in one session.

| Method | Path | Body |
|--------|------|------|
| POST | `/cart` | `{ productId }` |
| GET | `/cart` | |
| PUT | `/cart/:productId` | `{ count }` (string or number) |
| DELETE | `/cart/:productId` | remove line |
| DELETE | `/cart` | clear cart |
| PUT | `/cart` | `{ coupon }` apply coupon |

## Wishlist (token)

| Method | Path | Body |
|--------|------|------|
| POST | `/wishlist` | `{ productId }` |
| GET | `/wishlist` | |
| DELETE | `/wishlist/:productId` | |

## Addresses (token)

| Method | Path | Body |
|--------|------|------|
| POST | `/addresses` | `name`, `details`, `phone`, `city` (and API extras if documented) |
| GET | `/addresses` | |
| GET | `/addresses/:id` | |
| DELETE | `/addresses/:id` | |

## Orders (token)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/orders/:cartId` | cash order; shipping address in body |
| POST | `/orders/checkout-session/:cartId` | Stripe; query `url` = return origin |
| GET | `/orders` | all (admin-style; prefer user-scoped) |
| GET | `/orders/user/:userId` | that user's orders |

Confirm path params against Postman before implementing checkout (`url` query is required for Stripe session return).

## Coupons

Admin CRUD exists on the API. The storefront only **applies** a code via cart (`PUT /cart` + `{ coupon }`). Do not build an admin coupon UI unless asked.
