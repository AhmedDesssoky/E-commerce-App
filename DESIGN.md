---
name: Editorial Souk
description: Bilingual Route storefront — warm paper, ink type, saffron action; the product photo sells.
colors:
  saffron: "#C45C26"
  saffron-deep: "#9A4318"
  paper: "#F6F1EA"
  bone: "#FFFBF6"
  ink: "#1A1714"
  mute: "#6B645C"
  line: "#E6DDD2"
  sale: "#B42318"
  success: "#0F7B4A"
  paper-dark: "#14110E"
  bone-dark: "#1F1B17"
  ink-dark: "#F6F1EA"
  mute-dark: "#A89F94"
  line-dark: "#3A342E"
  saffron-dark: "#D47A4A"
  saffron-deep-dark: "#E3A57E"
  sale-dark: "#E38B84"
  success-dark: "#6BC497"
typography:
  display:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  title:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  price:
    fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
components:
  button-primary:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.saffron-deep}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  input-default:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    typography: "{typography.body}"
  card-product:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0"
  chip-sale:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    typography: "{typography.label}"
  chip-stock:
    backgroundColor: "{colors.line}"
    textColor: "{colors.mute}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    typography: "{typography.label}"
---

# Design System: Editorial Souk

## Overview

**Creative North Star: "Editorial Souk"**

A contemporary Cairo/Gulf gallery that also has a till. Shoppers browse a Route catalog in English and Arabic. Product photography does the selling; chrome recedes. The storefront is a quiet paper room: warm, bilingual, unhurried — until the saffron button asks for a decision.

Density is editorial, not marketplace-cluttered. Catalog and product pages **Persuade**. Cart, checkout, auth, and orders **Operate**: obvious, fast, no fashion-layout tricks. One family of type carries both scripts so the shop never feels like two skins glued together.

**Key Characteristics:**
- Warm paper canvas, ink text, one saffron action color
- Product image is always the largest object on the card and the PDP
- IBM Plex Sans + IBM Plex Sans Arabic as a single bilingual voice
- Logical CSS and `dir` from locale; cart sheet opens from `inline-end`
- Two rooms: warm paper (light) and espresso (dark); same spice, same type

## Colors

A dry-goods palette: paper, bone, ink, and a spice used sparingly.

### Primary
- **Saffron rust** (`#C45C26`): Primary buttons, in-stock price emphasis, focus ring. Rarity is the point.
- **Saffron deep** (`#9A4318`): Hover / pressed on primary only.

### Neutral
- **Warm paper** (`#F6F1EA`): Page canvas (`body` background).
- **Bone** (`#FFFBF6`): Cards, sheets, inputs, elevated surfaces.
- **Ink** (`#1A1714`): Headlines, body, icons.
- **Mute** (`#6B645C`): Secondary copy, placeholders, inactive nav.
- **Line** (`#E6DDD2`): Hairline borders and dividers — not drop shadows.

### Semantic
- **Sale crimson** (`#B42318`): Discount badges and struck prices only.
- **Grove** (`#0F7B4A`): Success toasts and paid/confirmed order states.

**The One Spice Rule.** Saffron occupies ≤10% of any screen. Never use it as a wash, hero background, or link color for every nav item.

**The Two Rooms Rule.** Light is warm paper (`#F6F1EA` / `#FFFBF6`). Dark is espresso (`#14110E` / `#1F1B17`), not cool zinc. Invert ink/paper for type; keep saffron as the only accent. Apply `html.dark` (next-themes). Product photos sit on **bone**, never on raw espresso void.

### Dark (espresso)
- **Canvas / paper** (`#14110E`): Page background.
- **Bone** (`#1F1B17`): Cards, sheets, inputs — one step up from canvas.
- **Ink** (`#F6F1EA`): Type (light-room paper reused as text).
- **Mute** (`#A89F94`): Secondary copy.
- **Line** (`#3A342E`): Hairlines.
- **Saffron** (`#D47A4A`): CTA and price; hover **`#E3A57E`** (lighter on dark, not deeper).
- **Sale** (`#E38B84`) / **Grove** (`#6BC497`): Lifted for contrast on espresso.

## Typography

**Display Font:** IBM Plex Sans / IBM Plex Sans Arabic (system-ui, sans-serif)
**Body Font:** same
**Price:** same family, `font-variant-numeric: tabular-nums`

**Character:** Neutral, engineered, bilingual. No display serif. Arabic and Latin share weight and rhythm so switching locale does not change the shop's personality.

### Hierarchy
- **Display** (600, `clamp(1.75rem, 4vw, 2.5rem)`, 1.2): Home/category titles only.
- **Headline** (600, 1.5rem, 1.3): Product title on PDP, checkout heading.
- **Title** (500, 1.125rem, 1.4): Product card titles, section labels.
- **Body** (400, 1rem, 1.6, max ~65ch): Descriptions, form help, empty states.
- **Label** (500, 0.8125rem, 1.4): Buttons, badges, nav, field labels. Sentence case. Arabic uses glossary **noun** forms (إضافة إلى السلة, إتمام الطلب).
- **Price** (600, 1.125rem, 1.3, tabular nums): EGP. In `ar`, currency follows the amount.

**The One Voice Rule.** Do not introduce a second display face for English heroes. Do not use Tajawal/Cairo for Arabic and Geist for English.

## Layout

8px base grid. Page gutter 24px on small screens, 48px from `md` up. Content max 1280px, centered.

Catalog: 2 columns (phone), 3 (`md`), 4 (`lg`). Cards share one height; image area is 4:5. Product page: image column first (start), buy column second (end) — this flips automatically in RTL when using CSS grid with logical placement, not `left`/`right`.

Cart is a **sheet from `inline-end`**, not a full page, until checkout. Checkout is a single column, max 36rem, stepper on top, no competing merchandising.

## Elevation & Depth

Flat by default. Depth comes from paper-on-bone contrast and a 1px `{colors.line}` border, not drop shadows.

Hover on a product card: image scales ~1.03 over 180ms. No card lift, no colored shadow.

Sheets and dialogs: bone fill, 1px line, optional 24px blur scrim (`ink` at 40% opacity). No material-elevation ladder.

**The Resting Flat Rule.** Shadows do not appear at rest. Do not add `shadow-lg` to cards to "make them pop."

## Shapes

- Inputs and buttons: 8px (`rounded.sm`)
- Product cards, sheets: 12px (`rounded.md`)
- Badges, quantity pills, avatar chips: full pill
- Images: inherit card radius on the top (or inline-start in horizontal cards); no circle-cropped product photos
- Hairline 1px `{colors.line}` — never 2px marketing outlines

## Components

Implementation layer: Tailwind v4 CSS variables → shadcn primitives → a small shop kit. ReUI **Frame** surface only; do not mix Card-surface blocks. Do not depend on ReUI Pro ecommerce page blocks for v1.

### Buttons
- **Shape:** 8px radius, 12×20 padding, label typography
- **Primary:** saffron on bone text. Hover saffron-deep. 180ms ease-out
- **Ghost:** transparent, ink text, line border. Used for wishlist and secondary cart actions
- **Focus:** 2px saffron ring, 2px offset. Never `outline: none` without a replacement
- Arabic labels stay noun-form. Do not conjugate (no يحفظ)

### Chips
- **Sale:** crimson pill, bone text, only when `price` < original
- **Out of stock:** line fill, mute text
- No rainbow "HOT" / "NEW" sticker stacks

### Cards / Containers
- Bone fill, 12px radius, 1px line, zero rest shadow
- Image is ≥70% of card height. Title + brand + price sit below, 16px padding
- Wishlist is an icon button on the image, inset-end 8px

### Inputs / Fields
- Bone fill, 8px radius, 1px line. Focus: saffron 2px ring
- Error: sale crimson border + body-size message, never only color
- Quantity: compact stepper, not a free text field as the primary control

### Navigation
- Sticky bone bar, 1px line under. Logo start, search, locale, wishlist, cart end
- Cart count is a saffron pill on the cart icon — the only persistent saffron in the chrome
- Mobile: bottom or overflow menu; do not shrink the catalog to fit six nav labels

### Signature: ProductCard
The system's fingerprint. 4:5 image, brand in mute label, title in title role (2-line clamp), `Price` with optional strike, primary "Add to cart" full width. Empty image: paper fill + mute placeholder, never a broken-icon jumble.

### Signature: Price
Always tabular nums. Sale uses crimson for the current amount and mute strike for the old. Locale formatter; `ar` puts EGP after the number.

### Signature: CartSheet
Bone sheet from `inline-end`. Line items with qty stepper, coupon field, saffron checkout CTA. Empty state uses glossary copy (السلة فارغة), not an illustration mashup.

## Do's and Don'ts

### Do:
- **Do** set `dir` from locale and use logical CSS (`margin-inline-start`, `ps-`/`pe-`, `inset-inline-end`).
- **Do** load IBM Plex Sans and IBM Plex Sans Arabic together; subset both.
- **Do** keep saffron for primary actions and the cart badge only.
- **Do** use next/image with Route CDN hosts; skeleton the 4:5 frame while loading.
- **Do** pull user-facing strings from next-intl using `docs/localization/ecommerce-arabic-glossary.md`.
- **Do** treat cart/checkout as Operate: one primary CTA, no carousels.

### Don't:
- **Don't** use generic indigo/violet as primary (SaaS default).
- **Don't** hardcode `dir="ltr"` on the app shell.
- **Don't** pair a Latin display serif with a different Arabic UI font.
- **Don't** put the JWT or Route `fetch` in Client Components; chrome stays visual-only.
- **Don't** use cool gray/zinc dark themes, autoplay carousels, or stacked promotional badges.
- **Don't** leave product images on raw espresso — they sit on bone.
- **Don't** mix ReUI Frame blocks with Card-surface blocks on the same shopper flow.
