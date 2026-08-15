---
name: ecommerce-i18n
description: >-
  Enforce en+ar copy, next-intl keys, official Arabic glossary, and RTL layout
  for this storefront. Use when adding UI strings, when the user says "i18n",
  "arabic", "rtl", "translation", or when a locale file / CSS / layout dir changes.
---

# Ecommerce i18n + RTL

Glossary wins: `docs/localization/ecommerce-arabic-glossary.md` (repo root). Read it before writing any Arabic string.

## Copy

- Add the same key to `messages/en/` and `messages/ar/` (identical shape).
- No hardcoded user-facing English in TSX. Use `useTranslations` / `getTranslations`.
- Buttons: noun form (حفظ، تعديل، حذف، إضافة، تحديث، عرض). Never conjugated verbs (يحفظ).
- Success: start with **تم**.
- Do not translate Stripe, Google, Next.js, Route.

## RTL / layout

- `dir` from locale. No `dir="ltr"` on the app shell.
- Logical CSS only (`margin-inline-start`, `ps-`/`pe-` Tailwind, `start`/`end`).
- Flip directional icons in `ar`; do not flip trash/edit/close.
- Dates/numbers/currency via next-intl formatters. Amounts in EGP; in Arabic the currency follows the number.

## Severity

- Missing `ar` key → **High**
- Glossary synonym clash → **High**
- Hardcoded UI string → **Medium**
- Physical CSS in a shared layout → **High**
- Hardcoded `dir="ltr"` on a page shell → **Critical**
