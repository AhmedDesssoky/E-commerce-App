# CONTEXT

Glossary for this Route API storefront. Implementation details do not belong here.

## Terms

- **Storefront** — this Next.js app. It does not own product data.
- **Route API** — public REST backend at ecommerce.routemisr.com. Source of products, users, cart, orders.
- **Customer / User** — the shopper account returned by Route auth (`user` + JWT).
- **Catalog** — public products, categories, subcategories, and brands.
- **Cart** — per-user bag of product lines. Requires auth. Use API v2 cart responses.
- **Wishlist** — per-user saved products. Not a cart.
- **Coupon** — code applied to the cart. Storefront applies codes; it does not administer coupons.
- **Checkout** — creating an order from the current cart. Two modes: cash on delivery, or Stripe checkout session.
- **Order** — a placed cart. Immutable from the storefront except as the API allows.
- **Address** — a saved shipping address on the user.
- **Token** — JWT issued by Route. Stored in an httpOnly cookie on the storefront; sent to Route as header `token`.
