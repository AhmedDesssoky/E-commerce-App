---
name: nextjs-architecture-guard
description: >-
  Enforce Next.js App Router layering for this Route storefront: thin pages,
  Server Components by default, typed API client, Zod-validated Server Actions,
  no fetch in JSX. Use when the user says "guard architecture", "check layering",
  "thin page", "thin controller", or after changing app/, components/, lib/, or
  Server Actions.
---

# Next.js architecture guard

Review changed `app/`, `components/`, and `lib/` files. Fix layering before presenting the diff.

## Layers

| Layer | Lives in | May |
|-------|----------|-----|
| UI | `app/**/page.tsx`, `components/` | Render props, call Actions/hooks |
| Actions | `app/**/actions.ts` or `lib/actions/` | Validate (Zod), call `lib/api`, revalidate paths |
| API | `lib/api/` | Talk to Route API only |
| Auth | `lib/auth/` | Cookie read/write, session helpers |

Pages and layouts must not contain business rules (price math, cart merge, auth branching beyond `if (!session) redirect`).

## Checks

1. **RSC default** — Client Components are leaves. Data fetching happens in Server Components or Actions.
2. **No Route URLs in UI** — `ecommerce.routemisr.com` appears only in `lib/api/` (or env).
3. **Cookie boundary** — `cookies()` / JWT only in server code. Client gets `user` DTO, not the token.
4. **Env** — `NEXT_PUBLIC_*` is public. API base URL is OK public; secrets are not.
5. **i18n routing** — locale prefix via next-intl. Shared pathnames in one config.
6. **Colocation** — feature folders beat giant `components/`. Extract a component only when a second caller exists (YAGNI).
7. **Types** — no `any` on API payloads. Parse with Zod at the boundary.

## Output

For each violation: problem, why, concrete fix, severity (Critical / High / Medium / Low).

Critical: token or fetch-to-Route inside a Client Component; secrets in `NEXT_PUBLIC_*`.  
High: business logic in a page; untyped `fetch`; cached private cart data.  
Medium: oversized page file; duplicated fetch wrappers.  
Low: naming / folder nits.
