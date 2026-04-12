# DESIGN.md - Dubai Croquet Club Design System

## Brand Identity

- **Name**: Dubai Croquet Club
- **Tone**: Playful, irreverent, social-sport club. Not corporate.
- **Logo**: `/images/dlcc-logo.webp` (header), `/images/DCC-LOGO-COLOUR.svg` (footer)
- **Favicon**: `/images/dlcc-logo-1.ico`
- **Implementation rule**: preserve the legacy site's public feel and composition while using shadcn primitives as the underlying implementation layer
- **Operational note**: local design review should use `.env.development` as the primary env file, with `.env.local` reserved for machine-specific overrides so preview and Tina behavior stay predictable across the team

## Color Palette

### Primary Colors

| Token             | Hex       | Usage                                    |
| ----------------- | --------- | ---------------------------------------- |
| Primary (Green)   | `#8cc63f` | CTAs, accent highlights, primary buttons |
| Secondary (Brown) | `#5a4a42` | Body text, headings, dark sections       |
| Main (Off-white)  | `#f6f1ed` | Page background, default section bg      |
| Light             | `#ffffff` | Cards, white sections                    |

### On-Colors (Text on colored backgrounds)

| Token            | Hex       | Usage                         |
| ---------------- | --------- | ----------------------------- |
| On Primary       | `#5a4a42` | Text on green backgrounds     |
| On Secondary     | `#ffffff` | Text on brown backgrounds     |
| On Light         | `#5a4a42` | Text on white backgrounds     |
| On Dark          | `#ffffff` | Text on dark backgrounds      |
| On Complementary | `#5a4a42` | Text on off-white backgrounds |

### Section Color Schemes

The old site uses named color schemes applied per-section. Map these to CSS classes or data attributes:

| Scheme     | Background            | Foreground        | Typical Usage                                      |
| ---------- | --------------------- | ----------------- | -------------------------------------------------- |
| `colors-a` | `#ffffff` (white)     | `#5a4a42` (brown) | Header, card-like light sections                   |
| `colors-f` | `#8cc63f` (green)     | `#5a4a42` (brown) | Accent/CTA sections, mobile menu                   |
| `colors-h` | `#f6f1ed` (off-white) | `#5a4a42` (brown) | Default page background and complementary sections |

### shadcn/ui CSS Variable Mapping

Update `:root` in `globals.css`:

```css
:root {
  --background: #f6f1ed;
  --foreground: #5a4a42;
  --card: #ffffff;
  --card-foreground: #5a4a42;
  --popover: #ffffff;
  --popover-foreground: #5a4a42;
  --primary: #8cc63f;
  --primary-foreground: #ffffff;
  --secondary: #5a4a42;
  --secondary-foreground: #ffffff;
  --muted: #ebe5df;
  --muted-foreground: #7a6a62;
  --accent: #f0f9e8;
  --accent-foreground: #3d6b1a;
  --destructive: #dc2626;
  --border: #d4cfc9;
  --input: #d4cfc9;
  --ring: #8cc63f;
}
```

## Typography

### Fonts

| Slot    | Font              | CSS Variable     | Usage                            |
| ------- | ----------------- | ---------------- | -------------------------------- |
| Display | Noto Sans Display | `--font-display` | Headlines and prominent callouts |
| Sans    | Poppins           | `--font-sans`    | Body text, UI elements, nav      |
| Mono    | DM Mono           | `--font-mono`    | Code, technical content          |

### Heading Scale

From the old site's style.json, applied to Tailwind classes:

| Level | Size | Weight | Tailwind               |
| ----- | ---- | ------ | ---------------------- |
| H1    | 6xl  | normal | `text-6xl font-normal` |
| H2    | 5xl  | normal | `text-5xl font-normal` |
| H3    | 3xl  | normal | `text-3xl font-normal` |
| H4    | 2xl  | bold   | `text-2xl font-bold`   |
| H5    | xl   | bold   | `text-xl font-bold`    |
| H6    | lg   | bold   | `text-lg font-bold`    |

Hero headlines should follow the legacy site's sans-serif treatment rather than the template's serif defaults. Use shadcn components, but theme them to match the legacy site instead of inheriting template styling.

## Button Styles

| Variant   | Background  | Border                   | Radius                | Padding     |
| --------- | ----------- | ------------------------ | --------------------- | ----------- |
| Primary   | `#8cc63f`   | none                     | none (`rounded-none`) | `px-8 py-3` |
| Secondary | transparent | `2px solid currentColor` | none                  | `px-8 py-3` |
| Link      | transparent | none                     | none                  | none        |

Links are uppercase by default: `uppercase tracking-normal font-normal`.

## Component-to-Section Mapping

Each page is composed of typed sections. The section renderer maps `_template` values to components:

| Section Type              | Component File                           | shadcn/ui Components Used                |
| ------------------------- | ---------------------------------------- | ---------------------------------------- |
| `heroSection`             | `sections/hero-section.tsx`              | Button, Badge                            |
| `textSection`             | `sections/text-section.tsx`              | (markdown renderer)                      |
| `ctaSection`              | `sections/cta-section.tsx`               | Button                                   |
| `featuredItemsSection`    | `sections/featured-items-section.tsx`    | Card, CardHeader, CardTitle, CardContent |
| `testimonialsSection`     | `sections/testimonials-section.tsx`      | Card, Avatar                             |
| `contactSection`          | `sections/contact-section.tsx`           | Input, Textarea, Label, Button           |
| `faqSection`              | `sections/faq-section.tsx`               | Accordion                                |
| `quoteSection`            | `sections/quote-section.tsx`             | Separator                                |
| `mediaGallerySection`     | `sections/media-gallery-section.tsx`     | Dialog (lightbox)                        |
| `featuredPeopleSection`   | `sections/featured-people-section.tsx`   | Card, Avatar                             |
| `featureHighlightSection` | `sections/feature-highlight-section.tsx` | Badge, Button                            |
| `recentPostsSection`      | `sections/recent-posts-section.tsx`      | Card                                     |
| `featuredPostsSection`    | `sections/featured-posts-section.tsx`    | Card                                     |
| `postFeedSection`         | `sections/post-feed-section.tsx`         | Card                                     |

## Layout

### Content Widths

- **Wide**: `max-w-[75rem]` (1200px) - full-width sections
- **Narrow**: `max-w-[40rem]` (640px) - text-heavy content, forms

### Section Padding

Default section padding: `py-16 px-4` on mobile, `py-24 px-8` on desktop.

### Header

- Logo left, navigation right (variant-c from old site)
- Narrow width container
- Padding: `py-5 px-4`
- Mobile: hamburger menu (Sheet component)

### Footer

- Off-white background (`colors-h`: `#f6f1ed` bg, `#5a4a42` text)
- Four columns: Logo+title, Contact details, Primary links, Social links
- Legal links and copyright below
- Narrow width container
- Padding: `py-16 px-4`

## Pages

Full page list with routes:

| Page                | Route                  | Key Sections                                                                              |
| ------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| Home                | `/`                    | Hero, TextSection, Hero (season), CTA, FeaturedItems (benefits), Testimonials, Newsletter |
| The Game            | `/the-game`            | Quote, TextSection (rules), CTA, Hero (court diagrams)                                    |
| Events              | `/events`              | FeaturedItems (event cards)                                                               |
| Leader Board        | `/leader-board`        | Hero, FeaturedItems (rankings)                                                            |
| FAQ                 | `/faq`                 | FAQ accordion, ContactSection (mailing list)                                              |
| News                | `/news`                | RecentPosts (blog feed)                                                                   |
| Gallery             | `/gallery`             | MediaGallery (6 images, 2-col)                                                            |
| About Us            | `/about-us`            | FeatureHighlight, FeaturedPeople (8 team members)                                         |
| Contact Us          | `/contact-us`          | ContactSection (form)                                                                     |
| Player Registration | `/player-registration` | ContactSection (registration form)                                                        |
| Links               | `/links`               | TextSection (external resources)                                                          |
| Blog Post           | `/blog/[slug]`         | Post layout with title, date, image, body, bottomSections                                 |
| Privacy Policy      | `/privacy-policy`      | TextSection                                                                               |
| Terms               | `/termsandconditions`  | TextSection                                                                               |

## Navigation

### Primary Nav (Header)

Home, The Game, Events, Leader Board, FAQ, News, Gallery, About Us, Contact Us

### Footer Nav

Primary: Home, Links, Player Registration
Legal: Privacy Policy, Terms & Conditions
Social: Twitter, Facebook, Instagram

### Contact Info

- Phone: +971 50 760 8210
- Email: hello@dubaicroquet.com
- Social: twitter.com/dubaicroquet, facebook.com/dubaicroquet, instagram.com/dubaicroquet

## Image Assets

All images stored in `public/images/`. Key assets:

- **Logos**: `dlcc-logo.webp`, `DCC-LOGO-COLOUR.svg`, `dlcc-logo-1.ico`
- **Team photos**: `the-captain.jpg`, `ben.jpg`, `clare.jpg`, `jolianne.jpg`, `roxy.jpg`, etc.
- **Gallery**: `tina-shooting-hoops.jpg`, `long-distance-hywell.jpg`, `claire-walking-away.jpg`, etc.
- **Game diagrams**: `court_golf1.png`, `court_golf2.png`
- **Icons**: `faster.svg`, `smarter.svg`, `focused.svg`
- **Blog images**: `boris-tennis.webp`, `strategy-under-the-tree.jpg`, `croquet-setup.jpg`
