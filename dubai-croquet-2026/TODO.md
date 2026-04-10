# TODO.md - Dubai Croquet Club Migration Checklist

## Phase 0: Package Manager + Tooling

- [ ] Install pnpm globally if not present (`npm i -g pnpm`)
- [ ] Run `pnpm import` to convert `package-lock.json` to `pnpm-lock.yaml`
- [ ] Delete `package-lock.json`
- [ ] Create `.npmrc` with `shamefully-hoist=true` (needed for Next.js/TinaCMS compatibility)
- [ ] Run `pnpm install` and verify it succeeds
- [ ] Update `.husky/pre-commit` to use `pnpm` instead of `npx`
- [ ] Verify `pnpm run dev`, `pnpm test`, `pnpm run lint` all work

## Phase 1: Design Tokens + Brand Swap

- [ ] Update `src/app/globals.css` - swap indigo/zinc palette to Dubai Croquet colors (see DESIGN.md)
- [ ] Update `src/app/layout.tsx` - change metadata title to "Dubai Croquet Club", update description
- [ ] Copy all images from `old-croquet/public/images/` to `dubai-croquet-2026/public/images/`
- [ ] Replace `src/app/favicon.ico` with `dlcc-logo-1.ico`

## Phase 2: TinaCMS Integration

- [ ] Install `tinacms` and `@tinacms/cli` (dev) via pnpm
- [ ] Create `tina/config.ts` with collections: page, post, team, config
- [ ] Define section templates in tina config (heroSection, textSection, ctaSection, featuredItemsSection, testimonialsSection, contactSection, faqSection, quoteSection, mediaGallerySection, featuredPeopleSection, featureHighlightSection, recentPostsSection)
- [ ] Create content directory structure: `content/pages/`, `content/pages/blog/`, `content/data/`, `content/data/team/`
- [ ] Migrate page content from old-croquet markdown files (update dates to 2026 season)
- [ ] Migrate blog posts from old-croquet (update dates where appropriate)
- [ ] Migrate team member JSON files from old-croquet
- [ ] Migrate config.json (nav, footer, contact info)
- [ ] Create `src/lib/tina.ts` - TinaCMS client helpers (getPage, getPost, getAllPosts, getConfig)
- [ ] Update `next.config.ts` - add TinaCMS rewrite for `/admin`
- [ ] Add TinaCMS env vars to `.env.example` (NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN)
- [ ] Add pnpm scripts: `tina:dev`, `tina:build`
- [ ] **Test**: Verify `pnpm run tina:dev` starts and content is queryable

## Phase 3: Layout Shell

- [ ] Create `src/components/site-header.tsx` - responsive header with logo, nav, mobile menu
- [ ] Create `src/components/site-footer.tsx` - footer with logo, contact, links, social, legal
- [ ] Create `src/app/(public)/layout.tsx` - public route group wrapping SiteHeader + SiteFooter
- [ ] Verify `src/middleware.ts` allows unauthenticated access to public routes
- [ ] Remove or redirect old `src/app/page.tsx` (Monolith Industries landing)
- [ ] **Test**: Write unit tests for SiteHeader (renders nav links, logo) and SiteFooter (renders contact info, social links)

## Phase 4: Section Components

- [ ] Create `src/components/sections/section-renderer.tsx` - dispatches section type to component
- [ ] Create `src/components/markdown-renderer.tsx` - shared markdown-to-HTML renderer
- [ ] Create `src/components/sections/hero-section.tsx` - hero with title, subtitle, image, actions, badge
- [ ] Create `src/components/sections/text-section.tsx` - title + markdown body
- [ ] Create `src/components/sections/cta-section.tsx` - call-to-action with title, text, buttons
- [ ] Create `src/components/sections/featured-items-section.tsx` - grid of Card items
- [ ] Create `src/components/sections/testimonials-section.tsx` - testimonial cards with Avatar
- [ ] Create `src/components/sections/contact-section.tsx` - dynamic form with Input/Textarea/Label
- [ ] Create `src/components/sections/faq-section.tsx` - Q&A accordion
- [ ] Create `src/components/sections/quote-section.tsx` - blockquote with attribution
- [ ] Create `src/components/sections/media-gallery-section.tsx` - image grid with lightbox
- [ ] Create `src/components/sections/featured-people-section.tsx` - team member grid with Avatar
- [ ] Create `src/components/sections/feature-highlight-section.tsx` - feature with image + badge
- [ ] Create `src/components/sections/recent-posts-section.tsx` - blog post card grid
- [ ] **Test**: Write unit tests for each section component (renders with mock props, handles missing optional props)
- [ ] **Test**: Write unit test for SectionRenderer (dispatches to correct component by _template)

## Phase 5: Page Routes

- [ ] Create `src/app/(public)/[[...slug]]/page.tsx` - catch-all route rendering CMS pages
- [ ] Create `src/app/(public)/blog/[slug]/page.tsx` - individual blog post page
- [ ] Add `generateStaticParams` to both routes for static generation
- [ ] Add `generateMetadata` for SEO (title, description, OG images)
- [ ] **Test**: Write integration tests verifying pages render with TinaCMS content

## Phase 6: Form Handling

- [ ] Create `src/app/api/contact/route.ts` - contact form POST handler with Zod validation
- [ ] Create `src/app/api/newsletter/route.ts` - newsletter signup handler
- [ ] Create `src/app/api/registration/route.ts` - player registration handler
- [ ] Wire ContactSection component to POST to appropriate API routes
- [ ] **Test**: Write unit tests for each API route (valid input, invalid input, missing fields)

## Phase 7: Polish

- [ ] Install shadcn/ui Accordion component (`pnpm dlx shadcn add accordion`)
- [ ] Install shadcn/ui Sheet component (`pnpm dlx shadcn add sheet`) for mobile nav
- [ ] Install shadcn/ui Checkbox and Select components for forms
- [ ] Update `next.config.ts` - add image domain allowlisting for external blog images
- [ ] Responsive testing: mobile (375px), tablet (768px), desktop (1280px+)
- [ ] Visual comparison against live dubaicroquet.com

## Phase 8: Build Verification + Deployment

- [ ] Run `pnpm run tina:build` (TinaCMS build)
- [ ] Run `pnpm run build` (Next.js production build)
- [ ] Run `pnpm test` and fix any failures
- [ ] Run `pnpm run lint` and fix any issues
- [ ] Run `pnpm run check:circular` - verify no circular dependencies
- [ ] **E2E**: Write Playwright tests for key user flows (navigate all pages, submit contact form, view blog post)
- [ ] Configure Vercel project with TinaCMS env vars
- [ ] Deploy to Vercel and verify
- [ ] Set up Tina Cloud project and connect to repo
