<div align="center">
  <img src="docs/logo.png" alt="Monolith Industries" width="120">
  <h1>MONOLITH INDUSTRIES</h1>
  <p><strong>Highly-opinionated, enterprise-grade Next.js infrastructure for one person.</strong></p>
  <p>
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjosheche%2Fmonolith-industries&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>
  </p>
  <p>
    <a href="#quick-start">Get Started</a> &middot;
    <a href="#whats-included">What's Included</a> &middot;
    <a href="#customization">Customization</a>
  </p>
</div>

---

## What's Included

| Layer                | Stack                                                                  | Status |
| -------------------- | ---------------------------------------------------------------------- | ------ |
| **Auth**             | Supabase Auth, magic link/OTP, signup + login pages, `useOtpFlow` hook | Ready  |
| **Database**         | Supabase Postgres, Drizzle ORM, empty schema                           | Ready  |
| **Background Jobs**  | pg-boss worker scaffold                                                | Ready  |
| **Error Monitoring** | Sentry client/server/edge, session replay, `/monitoring` tunnel        | Ready  |
| **Analytics**        | Vercel Analytics + Speed Insights                                      | Ready  |
| **Design System**    | Tailwind v4 + shadcn/ui, zinc + indigo tokens                          | Ready  |
| **Tooling**          | ESLint, Prettier, Husky, lint-staged, madge                            | Ready  |
| **E2E Tests**        | Playwright auth flows against real local Supabase                      | Ready  |

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐
│  Vercel          │     │  Railway (optional)   │
│  Next.js App     │     │  Worker (pg-boss)     │
│                  │     │  Background jobs      │
│  Dashboard (CSR) │     │                       │
│  API Routes      │     └──────────┬────────────┘
└────────┬─────────┘                │
         │                          │
         └──────────┬───────────────┘
                    │
         ┌──────────▼────────────┐
         │  Supabase Cloud       │
         │  - Postgres (Drizzle) │
         │  - Auth (magic link)  │
         │  - Storage (media)    │
         └───────────────────────┘
```

## Quick Start

**Prerequisites:** Node.js 24 LTS (`.nvmrc` included), Docker Desktop

```bash
git clone https://github.com/pie-rs/dubai-croquet.git
cd dubai-croquet/dubai-croquet-2026
pnpm install
cp .env.example .env.development

pnpm dlx supabase start      # start local Postgres, Auth, Storage, Mailpit
pnpm dlx supabase status     # copy local URLs + keys into your chosen local env file

pnpm run dev                 # http://localhost:3000
pnpm run worker              # optional: background job worker
```

| Service          | URL                    |
| ---------------- | ---------------------- |
| App              | http://localhost:3000  |
| Supabase Studio  | http://127.0.0.1:54323 |
| Mailpit (emails) | http://127.0.0.1:54324 |
| Supabase API     | http://127.0.0.1:54321 |

## Environment Files

Next.js loads multiple env files. In local development for this project, you will usually see:

- `.env`
- `.env.development`
- `.env.local`

Use them like this:

### `.env.example`

Template only. This is the committed reference for the variables the app knows about.

- Use it to create your real local env files.
- Do not put real secrets in this file.

### `.env.development`

Primary local development config for this project.

- Use this for the shared local dev setup you expect to use while running `pnpm run dev` or `pnpm run tina:dev`.
- This is the right place for your current Tina Cloud variables.
- It is also a reasonable place for local Supabase values if you want one main local-dev file.

Example uses:

- `NEXT_PUBLIC_TINA_BRANCH`
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `TINA_SEARCH_TOKEN`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

### `.env.local`

Developer-specific overrides on your machine.

- Use this when you want to override values from `.env.development` without changing the shared local-dev baseline.
- Good for machine-specific secrets or temporary overrides.
- If the same variable exists in both `.env.development` and `.env.local`, treat `.env.local` as the override.

Typical use:

- personal Supabase project values
- temporary Tina or API overrides
- experimental local settings you do not want to treat as the main project defaults

### `.env`

Lowest-priority fallback defaults.

- Keep this minimal.
- Avoid putting important local secrets here unless you intentionally want them to act as base defaults.
- In practice, prefer `.env.development` and `.env.local` for local work on this repo.

### `.env.test`

Test-only environment file.

- Create this from `.env.test.example` when running Playwright or other test flows that expect a dedicated test environment.
- Do not use this as your normal development env file.

```bash
cp .env.test.example .env.test
```

### Vercel Environment Variables

Use Vercel project environment variables for deployed environments.

- Production secrets belong in Vercel, not in committed files.
- Preview-specific values also belong in Vercel.
- The local `.env*` files are for local development only.

### Practical Policy For This Repo

- Use `.env.development` as your main local development file.
- Use `.env.local` only when you need machine-specific overrides.
- Use `.env.test` only for E2E or test-specific runs.
- Use Vercel env vars for preview and production.

### Common Variables

**Tina Cloud**

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=
TINA_TOKEN=
TINA_SEARCH_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Supabase / Database**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

**Sentry**

```env
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

### When Values Are Actually Required

- Public page rendering does not require Supabase env vars to exist.
- Tina admin requires the Tina Cloud variables once you are using Tina Cloud-backed editing.
- Form persistence requires `DATABASE_URL`. If it is missing, form endpoints return `503` instead of crashing.
- Auth flows still need the Supabase public variables when you want the auth surface to function.

## Scripts

```bash
pnpm run dev                 # Next.js dev server (Turbopack)
pnpm run worker              # pg-boss background worker
pnpm run build               # production build
pnpm run lint                # ESLint
pnpm run format              # Prettier
pnpm test                    # Vitest
pnpm run check:circular      # madge circular dep check
pnpm exec playwright test    # E2E auth flow tests
```

## Database

Schema starts empty at `src/db/schema.ts`. Add your tables:

```bash
pnpm exec drizzle-kit generate # create migration
pnpm exec drizzle-kit migrate  # apply migration
```

## E2E Tests

```bash
cp .env.test.example .env.test   # fill from `pnpm dlx supabase status`
pnpm exec playwright test        # requires local Supabase + dev server
```

## Tooling

Every commit runs through:

```
git commit → Husky pre-commit
  ├── lint-staged (eslint --fix + prettier --write)
  └── madge --circular
```

**Prettier:** no semi, single quotes, trailing commas, 100 char width
**ESLint:** flat config, Next.js Core Web Vitals + TypeScript
**TypeScript:** strict mode, `@/*` path alias

## Customization

1. **Brand** — replace "Monolith Industries" in `page.tsx`, auth pages, dashboard layout
2. **Accent color** — swap indigo values in `globals.css` (`:root` and `.dark`)
3. **Fonts** — change in `layout.tsx` via `next/font`
4. **Domain tables** — add to `src/db/schema.ts`, generate + migrate
5. **API routes** — add under `src/app/api/`
6. **Background jobs** — add in `src/worker/jobs/`, register in `src/worker/index.ts`

## Deployment

**Vercel** — auto-deploys on push to `main`
**Railway** (worker, optional) — start command: `pnpm run worker`
**Supabase** — create cloud project, run migrations, configure SMTP (Resend)

---

<div align="center">
  <sub>Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Drizzle · Supabase · pg-boss · Sentry · Vercel Analytics · Vitest · Playwright</sub>
</div>
