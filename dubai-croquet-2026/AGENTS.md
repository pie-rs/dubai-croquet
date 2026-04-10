# AGENTS.md - Instructions for AI Coding Agents

This file provides context and conventions for AI coding agents (Codex, Claude, etc.) working on the Dubai Croquet Club website migration.

## Project Overview

We are rebuilding the Dubai Croquet Club website (currently at dubaicroquet.com, built on Stackbit + Next.js 11) using a modern Next.js 16 template with TinaCMS (Tina Cloud) and shadcn/ui. The old site source is at `../old-croquet/` for reference.

The migration goal is to preserve the legacy public URLs, content, layout, and overall feel while re-implementing the UI using shadcn primitives plus project-specific composed components.

## Key Documents

- **CLAUDE.md** - Base template conventions (read this first)
- **DESIGN.md** - Design system: colors, fonts, component mapping, page structure
- **TODO.md** - Phased task checklist

## Architecture

### Package Manager

This project uses `pnpm`. All commands should use `pnpm`:

- `pnpm install`
- `pnpm run dev`
- `pnpm add <pkg>` / `pnpm add -D <pkg>`
- `pnpm dlx shadcn add <component>`
- `pnpm exec <tool>` for locally installed CLIs like `playwright`, `drizzle-kit`, and `lint-staged`
- `pnpm test`, `pnpm run lint`, `pnpm run build`
- Installs run from a nested project directory, so the `prepare` script intentionally skips Husky installation unless the package is the git root

### Two Processes (inherited from template)

1. **Next.js standalone web server** - serves pages and API Route Handlers
2. **Worker process** (`pnpm run worker`) - pg-boss consumer (not used yet)

### Content Architecture

- **CMS**: TinaCMS (Tina Cloud) - content stored as markdown/JSON in `/content/`
- **Schema**: Defined in `tina/config.ts`
- **Pages**: Section-based composition - each page is a list of typed sections
- **Blog**: MDX posts in `content/posts/`
- **Data**:
  - site config in `content/site/config.json`
  - team members in `content/team/`
  - public pages in `content/pages/`

### Route Structure

```
src/app/
  (public)/                    # Public content pages
    layout.tsx                 # SiteHeader + SiteFooter wrapper
    [[...slug]]/page.tsx       # Catch-all: renders CMS pages by slug
    blog/[slug]/page.tsx       # Blog post pages
  (auth)/                      # Auth pages (hidden from nav, still functional)
    login/page.tsx
    signup/page.tsx
  (dashboard)/                 # Dashboard (hidden from nav, still functional)
    dashboard/page.tsx
  api/
    contact/route.ts           # Contact form handler
    newsletter/route.ts        # Newsletter signup handler
    registration/route.ts      # Player registration handler
    health/route.ts            # Health check (existing)
    auth/confirm/route.ts      # Auth callback (existing)
```

### Section-Based Page Builder

Every content page is composed of sections. The `SectionRenderer` component maps each section's `_template` field to a React component:

```
heroSection         -> src/components/sections/hero-section.tsx
textSection         -> src/components/sections/text-section.tsx
ctaSection          -> src/components/sections/cta-section.tsx
featuredItemsSection -> src/components/sections/featured-items-section.tsx
testimonialsSection -> src/components/sections/testimonials-section.tsx
contactSection      -> src/components/sections/contact-section.tsx
faqSection          -> src/components/sections/faq-section.tsx
quoteSection        -> src/components/sections/quote-section.tsx
mediaGallerySection -> src/components/sections/media-gallery-section.tsx
featuredPeopleSection -> src/components/sections/featured-people-section.tsx
featureHighlightSection -> src/components/sections/feature-highlight-section.tsx
recentPostsSection  -> src/components/sections/recent-posts-section.tsx
```

## Conventions

### Code Style (from CLAUDE.md)

- No semicolons, single quotes, trailing commas, 100 char print width
- No Server Actions - all mutations through Route Handlers
- Route params are `Promise<>` in Next.js 16 - must `await params`
- Zod validates all API inputs

### Component Patterns

- Use shadcn/ui components from `src/components/ui/` - never build custom versions of what shadcn provides
- Install required shadcn primitives before building sections that depend on them
- Section components go in `src/components/sections/`
- Shared layout components (header, footer) go in `src/components/`
- All components use the `cn()` utility from `src/lib/utils.ts` for className merging
- Use Next.js `Image` component for all images (not `<img>`)
- Use `lucide-react` for icons

### TinaCMS Patterns

- Schema definition: `tina/config.ts`
- Client helpers: `src/lib/tina.ts`
- Content files:
  - `content/site/config.json`
  - `content/pages/*.json`
  - `content/posts/*.mdx`
  - `content/team/*.json`
- Run TinaCMS + dev server together: `pnpm run tina:dev`
- Build: `pnpm run tina:build && pnpm run build`
- The `_template` field on sections discriminates which component to render
- Use TinaCMS's generated client for all content queries
- For rich-text fields, use `@tinacms/mdx` or `TinaMarkdown` renderer
- Keep form field definitions in code via `formKey`; do not rebuild Stackbit's generic form-builder schema in Tina

### Styling Patterns

- Colors are defined as CSS variables in `globals.css` (see DESIGN.md for values)
- Section backgrounds use a color scheme system: `colors-a` (white), `colors-f` (green), `colors-h` (off-white)
- Each section component should accept a `colors` prop and apply the appropriate bg/text classes
- No dark mode - the old site had none
- Buttons: `rounded-none` (no border radius), `px-8 py-3` padding
- Links: uppercase by default

### Content Migration

- Old content lives in `../old-croquet/content/`
- Preserve all public URLs exactly
- Preserve historical blog dates
- Update only seasonal marketing/event copy where needed
- Keep the same playful, irreverent tone
- Preserve all team member data
- Images are in `public/images/` (copy from old site)
- Mirror remotely hosted blog images locally during migration

## Workflow Rules

- Every completed task or tightly scoped subtask must include:
  - relevant updates to `AGENTS.md`, `CLAUDE.md`, `TODO.md`, or `DESIGN.md` when assumptions or workflows change
  - passing local verification for the touched area
  - one atomic git commit before moving to the next task
- Prefer small, self-contained commits over broad phase-spanning commits
- Do not start section implementation until the required shadcn primitives have been installed

## Phase Dependencies

Phases must be completed in order. Within a phase, tasks can often be parallelized.

0. **Phase 0** (Tooling Baseline) - do first, before anything else
1. **Phase 1** (Primitive Foundation) - needs Phase 0
2. **Phase 2** (Design Token Recreation) - needs Phase 1
3. **Phase 3** (Tina Schema and Content Contracts) - needs Phase 2
4. **Phase 4** (Content and Media Migration) - needs Phase 3
5. **Phase 5** (Public Layout Shell) - needs Phase 4
6. **Phase 6** (Section System) - needs Phase 5
7. **Phase 7** (Routes and Blog Rendering) - needs Phase 6
8. **Phase 8** (Forms and Handlers) - needs Phase 6
9. **Phase 9** (Verification and Fidelity) - needs everything

## Testing

### Commands

- `pnpm test` - Vitest unit tests
- `pnpm run test:watch` - Vitest watch mode
- `pnpm run lint` - ESLint
- `pnpm run format:check` - Prettier
- `pnpm run check:circular` - madge circular dependency check
- `pnpm exec playwright test` - E2E tests

### Testing Strategy

Tests should be written alongside each task, not deferred to the end.

**Content and contract tests**:

- `getSiteConfig`, `getPage`, `getPost`, `getAllPosts`, and team queries return the expected shapes
- route/slug mapping preserves legacy public URLs

**Component tests**:

- each section type gets a focused rendering test with realistic fixture data
- `SectionRenderer` dispatches to the correct section by `_template`
- SiteHeader/SiteFooter render the expected nav, contact, and social data

**Form and API tests**:

- code-owned form schemas validate the right payloads
- API route handlers return success for valid input and `400` for invalid input
- `contactSection` selects the correct form by `formKey`

**E2E tests** (Playwright, `e2e/`):

- navigate every public route and verify it renders without errors
- submit newsletter, contact, and registration flows
- view a blog post from the news page
- verify responsive header behavior
- capture scoped visual comparison screenshots for key pages

**Test file conventions**:

- Co-locate unit tests: `src/components/sections/hero-section.test.tsx` next to `hero-section.tsx`
- API route tests: `src/app/api/contact/route.test.ts` next to `route.ts`
- E2E tests: `e2e/` directory (existing pattern)
- Use `vi.mock()` for TinaCMS client in component tests
- Use `@testing-library/react` for component rendering tests

## Environment Variables

Required for TinaCMS:

```
NEXT_PUBLIC_TINA_CLIENT_ID=   # From Tina Cloud dashboard
TINA_TOKEN=                    # From Tina Cloud dashboard
```

Existing (Supabase, Sentry) - see `.env.example`
