# GMEC Corporation — E-Commerce Site

A custom Next.js storefront for GMEC Corporation (LED lighting, fittings and
smart home gadgets), replacing the previous WordPress site.

## Stack

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**
- **Prisma** + **PostgreSQL** for the database (a local Postgres instance for dev, managed via pgAdmin)
- **NextAuth** (credentials) for customer accounts and an admin role
- **Stripe Checkout** for payment (falls back to a "demo checkout" that completes
  orders instantly if no Stripe keys are set, so the site works fully out of the box)
- **Zustand** for the client-side cart
- Light/dark theme, toggled from the header (persisted per-browser, defaults to system preference)

## Getting Started

```bash
npm install
npx prisma migrate dev   # applies the schema to your Postgres database
npm run db:seed          # seeds 10 categories, ~40 placeholder products, and demo users
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a running local Postgres instance with an empty database created
(this project uses one named `gmec_corporation`, managed via pgAdmin). Set
`DATABASE_URL` in `.env` to point at it — see Environment Variables below.

### Demo accounts (created by the seed script)

| Role     | Email                        | Password      |
| -------- | ----------------------------- | ------------- |
| Admin    | admin@gmeccorporation.com     | Admin123!     |
| Customer | customer@example.com          | Customer123!  |

Sign in as the admin to manage products, categories and orders at `/admin`.

## Environment Variables

Copy `.env.example` if you need to recreate `.env.local`. Values already set
for local dev:

- `DATABASE_URL` — points at the local Postgres database `gmec_corporation`
  (set in `.env`; format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — already generated for local dev

To enable **real payments**, add Stripe test keys from
[dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
to `.env.local`:

```
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Without these, checkout still works end-to-end (orders are created and marked
paid immediately) so you can test the full flow before wiring up Stripe. Use
the Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
to get a webhook secret for local testing once you add real keys.

## Replacing the placeholder catalog

All products and categories currently use placeholder text/images generated
via placehold.co, defined in `prisma/seed.ts`. To load your real catalog:

1. Edit or replace `prisma/seed.ts` with your real product data (or write a
   script/import that reads from a CSV export), including real image URLs.
2. Re-run `npm run db:seed`, or manage products directly from `/admin/products`.
3. For production, point `DATABASE_URL` at a hosted Postgres instance (e.g.
   Neon, Vercel Postgres, Supabase) and run `npx prisma migrate deploy`.

## Project Structure

Next.js requires pages and API routes to live under `src/app` for file-based
routing — those files stay thin and import their logic from two clearly
separated folders:

- `src/app` — routing only: pages, layouts and `route.ts` API handlers. Each
  file is a thin wrapper that imports from `frontend/` and `backend/`.
- `src/frontend` — everything client/UI-facing:
  - `components/` — UI components, grouped by area (layout, product, shop, admin, home, etc.)
  - `hooks/` — `useMounted`, `useTheme`
  - `store/cart.ts` — client-side cart (Zustand, persisted to localStorage)
  - `lib/` — display-only helpers (`formatPrice`, `slugify`, product image parsing)
- `src/backend` — everything server-facing:
  - `lib/` — Prisma client, NextAuth config, admin session check, Stripe client,
    shop query logic, validation schemas (zod), placeholder-image generator
  - `types/` — NextAuth session type augmentation
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seed script for categories, products and demo users

This keeps one Next.js app (one dev server, one deploy, server components can
still query Prisma directly with no extra network hop) while still giving you
a clean line between "what renders" and "what talks to the database/auth/payments."

## Deployment

Deploys cleanly to Vercel. Before deploying:

1. Provision a hosted Postgres database (e.g. Neon, Vercel Postgres, Supabase) and update `DATABASE_URL`.
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your production domain) and the Stripe
   env vars in your hosting provider's environment settings.
3. Add a Stripe webhook endpoint pointing at `https://yourdomain.com/api/webhooks/stripe`
   for the `checkout.session.completed` event.

After deploying the blog migration, sync the intended published posts to the
production database once:

```bash
npm run db:seed:blog
```

This command removes blog posts not listed in
`prisma/import/seed-blog-posts.js` and upserts the listed posts. Run it with the
production `DATABASE_URL`, not the local database URL.
