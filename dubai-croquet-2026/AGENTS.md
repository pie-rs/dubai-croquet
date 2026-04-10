# AGENTS.md - Instructions for AI Coding Agents

This file provides context and conventions for AI coding agents (Codex, Claude, etc.) working on the Dubai Croquet Club website migration.

## Project Overview

We are rebuilding the Dubai Croquet Club website (currently at dubaicroquet.com, built on Stackbit + Next.js 11) using a modern Next.js 16 template with TinaCMS (Tina Cloud) and shadcn/ui. The old site source is at `../old-croquet/` for reference.

## Key Documents

- **CLAUDE.md** - Base template conventions (read this first)
- **DESIGN.md** - Design system: colors, fonts, component mapping, page structure
- **TODO.md** - Phased task checklist

## Architecture

### Two Processes (inherited from template)

1. **Next.js standalone web server** - serves pages and API Route Handlers
2. **Worker process** (`npm run worker`) - pg-boss consumer (not used yet)

### Content Architecture

- **CMS**: TinaCMS (Tina Cloud) - content stored as markdown/JSON in `/content/`
- **Schema**: Defined in `tina/config.ts`
- **Pages**: Section-based composition - each page is a list of typed sections
- **Blog**: Markdown posts in `content/pages/blog/`
- **Data**: Site config and team members in `content/data/`

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
- Section components go in `src/components/sections/`
- Shared layout components (header, footer) go in `src/components/`
- All components use the `cn()` utility from `src/lib/utils.ts` for className merging
- Use Next.js `Image` component for all images (not `<img>`)
- Use `lucide-react` for icons

### TinaCMS Patterns

- Schema definition: `tina/config.ts`
- Client helpers: `src/lib/tina.ts`
- Content files: `content/pages/*.md`, `content/data/*.json`
- Run TinaCMS + dev server together: `npm run tina:dev`
- Build: `npm run tina:build && npm run build`
- The `_template` field on sections discriminates which component to render
- Use TinaCMS's generated client for all content queries
- For rich-text fields, use `@tinacms/mdx` or `TinaMarkdown` renderer

### Styling Patterns

- Colors are defined as CSS variables in `globals.css` (see DESIGN.md for values)
- Section backgrounds use a color scheme system: `colors-a` (off-white), `colors-f` (green), `colors-h` (brown)
- Each section component should accept a `colors` prop and apply the appropriate bg/text classes
- No dark mode - the old site had none
- Buttons: `rounded-none` (no border radius), `px-8 py-3` padding
- Links: uppercase by default

### Content Migration

- Old content lives in `../old-croquet/content/`
- Update dates from 2023 to 2026 season
- Keep the same playful, irreverent tone
- Preserve all team member data
- Images are in `public/images/` (copy from old site)

## Phase Dependencies

Phases must be completed in order. Within a phase, tasks can often be parallelized.

1. **Phase 1** (Design Tokens) - no dependencies, do first
2. **Phase 2** (TinaCMS) - needs Phase 1 for correct theming
3. **Phase 3** (Layout Shell) - needs Phase 2 for config data
4. **Phase 4** (Section Components) - needs Phase 3 for layout context
5. **Phase 5** (Page Routes) - needs Phase 4 for section components
6. **Phase 6** (Form Handling) - needs Phase 4 (ContactSection)
7. **Phase 7** (Polish) - needs all prior phases
8. **Phase 8** (Build/Deploy) - needs everything

## Testing

- `npm test` - Vitest unit tests
- `npm run lint` - ESLint
- `npm run format:check` - Prettier
- `npm run check:circular` - madge circular dependency check
- Visual comparison against dubaicroquet.com for design fidelity

## Environment Variables

Required for TinaCMS:
```
NEXT_PUBLIC_TINA_CLIENT_ID=   # From Tina Cloud dashboard
TINA_TOKEN=                    # From Tina Cloud dashboard
```

Existing (Supabase, Sentry) - see `.env.example`
