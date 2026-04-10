# TODO.md - Dubai Croquet Club Migration Checklist

Every task or tightly scoped subtask must end with:
- relevant doc updates when assumptions or workflow changed
- local verification for the touched area
- one atomic git commit before moving on

## Phase 0: Tooling Baseline

- [ ] Install pnpm globally if not present (`npm i -g pnpm`)
- [ ] Run `pnpm import` to convert `package-lock.json` to `pnpm-lock.yaml`
- [ ] Delete `package-lock.json`
- [ ] Add `.npmrc` only if TinaCMS requires hoisting
- [ ] Run `pnpm install`
- [ ] Update `.husky/pre-commit` and package scripts to use `pnpm`
- [ ] Update `CLAUDE.md`, `AGENTS.md`, `TODO.md`, and `DESIGN.md` to match the actual package-manager and migration plan
- [ ] **Verify**: `pnpm run lint`, `pnpm test`, `pnpm run check:circular`
- [ ] **Commit**: `chore: migrate tooling to pnpm`

## Phase 1: Primitive Foundation

- [ ] Install required shadcn primitives before section work: `accordion`, `sheet`, `select`, `checkbox`
- [ ] Confirm existing primitives remain the base layer: `button`, `card`, `avatar`, `dialog`, `input`, `textarea`, `label`, `separator`, `badge`
- [ ] Update docs to state "primitives first, then composed site components"
- [ ] **Verify**: imports resolve and app still builds after primitive additions
- [ ] **Commit**: `chore: add required shadcn primitives for migration`

## Phase 2: Design Token Recreation

- [ ] Replace the template zinc/indigo palette in `src/app/globals.css` with the Dubai Croquet palette
- [ ] Match the legacy site typography visually instead of preserving template defaults
- [ ] Add explicit mappings for `colors-a`, `colors-f`, and `colors-h`
- [ ] Update root metadata in `src/app/layout.tsx`
- [ ] Copy legacy images into `public/images`
- [ ] Replace the favicon with `dlcc-logo-1.ico`
- [ ] Update `DESIGN.md` with final fonts, tokens, and section-color guidance
- [ ] **Verify**: browser visual sanity check against the live site
- [ ] **Commit**: `feat: recreate dubai croquet design tokens and assets`

## Phase 3: Tina Schema and Content Contracts

- [ ] Install `tinacms` and `@tinacms/cli`
- [ ] Create `tina/config.ts`
- [ ] Add content roots:
  - `content/site/config.json`
  - `content/pages/*.json`
  - `content/posts/*.mdx`
  - `content/team/*.json`
- [ ] Create collections: `siteConfig`, `pages`, `posts`, `team`
- [ ] Keep form field definitions out of Tina; use `formKey` for code-owned forms
- [ ] Create `src/lib/tina.ts`
- [ ] Add Tina scripts and env vars
- [ ] Update docs with the final content model and non-goals
- [ ] **Test**: contract tests for `getSiteConfig`, `getPage`, `getPost`, `getAllPosts`, `getTeam`
- [ ] **Test**: route/slug mapping tests for `/`, `/the-game`, `/faq`, `/termsandconditions`
- [ ] **Verify**: `pnpm run tina:dev` starts and content is queryable
- [ ] **Commit**: `feat: add tina schema and content loading contracts`

## Phase 4: Content and Media Migration

- [ ] Migrate legacy config content into `content/site/config.json`
- [ ] Migrate team JSON into `content/team`
- [ ] Migrate public pages into `content/pages`
- [ ] Migrate all legacy blog posts into `content/posts`
- [ ] Preserve exact legacy slugs and historical post dates
- [ ] Mirror externally hosted inline blog images into local assets
- [ ] Rewrite blog markdown image references to local paths
- [ ] Clean malformed markdown only where needed for correct rendering
- [ ] Update docs with migration assumptions and asset conventions
- [ ] **Test**: content fixture tests for migrated route slugs
- [ ] **Test**: blog metadata tests for date, slug, featured image, optional author, bottom sections
- [ ] **Commit**: `feat: migrate legacy content and blog media`

## Phase 5: Public Layout Shell

- [ ] Create `src/components/site-header.tsx`
- [ ] Create `src/components/site-footer.tsx`
- [ ] Create `src/app/(public)/layout.tsx`
- [ ] Drive nav, footer, contact, and social data from Tina config
- [ ] Keep auth/dashboard/worker code intact and excluded from public navigation
- [ ] **Test**: header renders preserved nav links and logo
- [ ] **Test**: footer renders contact, legal, and social links
- [ ] **Test**: mobile menu opens and closes correctly
- [ ] **Commit**: `feat: add public site layout shell`

## Phase 6: Section System

- [ ] Create `src/components/sections/section-renderer.tsx`
- [ ] Create a shared markdown/MDX renderer
- [ ] Implement only the legacy-used section types:
  - `heroSection`
  - `textSection`
  - `ctaSection`
  - `featuredItemsSection`
  - `testimonialsSection`
  - `contactSection`
  - `faqSection`
  - `quoteSection`
  - `mediaGallerySection`
  - `featuredPeopleSection`
  - `featureHighlightSection`
  - `recentPostsSection`
- [ ] Compose sections from shadcn primitives; do not recreate Stackbit's generic style engine
- [ ] **Test**: focused component test for each section with realistic fixture data
- [ ] **Test**: section renderer dispatch test
- [ ] **Test**: optional-field handling tests where applicable
- [ ] **Commit strategy**: one atomic commit per small group of related sections

## Phase 7: Routes and Blog Rendering

- [ ] Create `src/app/(public)/[[...slug]]/page.tsx`
- [ ] Create `src/app/(public)/blog/[slug]/page.tsx`
- [ ] Add `generateStaticParams`
- [ ] Add `generateMetadata`
- [ ] Preserve exact legacy routes, including `/termsandconditions`
- [ ] Render blog `bottomSections`, supporting `recentPostsSection` in v1
- [ ] **Test**: route integration tests for public pages
- [ ] **Test**: blog route tests for slug, date, featured image, body, and bottom section rendering
- [ ] **Commit**: `feat: add public page and blog routes`

## Phase 8: Forms and Handlers

- [ ] Create code-owned form definitions for `contact`, `newsletter`, and `registration`
- [ ] Create `src/app/api/contact/route.ts`
- [ ] Create `src/app/api/newsletter/route.ts`
- [ ] Create `src/app/api/registration/route.ts`
- [ ] Wire `contactSection` to select the correct code-owned form via `formKey`
- [ ] Validate all form payloads with Zod
- [ ] **Test**: unit tests for form schemas
- [ ] **Test**: API route tests for valid and invalid payloads
- [ ] **Test**: component tests for correct form selection by `formKey`
- [ ] **Commit**: `feat: add public forms and validated route handlers`

## Phase 9: Verification and Fidelity

- [ ] Add Playwright coverage for:
  - public route smoke checks
  - mobile nav
  - newsletter submit
  - contact submit
  - registration submit
  - blog post render
- [ ] Add scoped screenshot checks for:
  - homepage
  - one content page
  - one blog post
  - one form page
  - mobile header/menu state
- [ ] Compare the new site against the live site for layout, spacing, typography, imagery, and responsive behavior
- [ ] Update docs with the verification workflow and any intentional differences
- [ ] **Verify**: `pnpm run tina:build`, `pnpm run build`, `pnpm test`, `pnpm run lint`, `pnpm run check:circular`
- [ ] **Commit**: `test: add migration smoke and visual regression coverage`
