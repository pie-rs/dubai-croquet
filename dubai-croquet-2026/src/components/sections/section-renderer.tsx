import { CtaSection } from '@/components/sections/cta-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FeatureHighlightSection } from '@/components/sections/feature-highlight-section'
import { FeaturedItemsSection } from '@/components/sections/featured-items-section'
import { FeaturedPeopleSection } from '@/components/sections/featured-people-section'
import { FaqSection } from '@/components/sections/faq-section'
import { HeroSection } from '@/components/sections/hero-section'
import { MediaGallerySection } from '@/components/sections/media-gallery-section'
import { QuoteSection } from '@/components/sections/quote-section'
import { RecentPostsSection } from '@/components/sections/recent-posts-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { TextSection } from '@/components/sections/text-section'
import type { NarrativeSection, SectionPostSummary, SectionTeamMember } from '@/components/sections/types'
import { getAllPosts, getTeam } from '@/lib/tina'

type SectionRendererProps = {
  sections: Array<Record<string, unknown>>
  currentPostSlug?: string
}

export async function SectionRenderer({ sections, currentPostSlug }: SectionRendererProps) {
  const needsTeam = sections.some(
    (section) =>
      typeof section._template === 'string' &&
      (section._template === 'featuredPeopleSection' ||
        section._template === 'recentPostsSection'),
  )
  const needsPosts = sections.some(
    (section) => typeof section._template === 'string' && section._template === 'recentPostsSection',
  )

  const [team, posts] = await Promise.all([needsTeam ? getSectionTeam() : [], needsPosts ? getSectionPosts() : []])
  const authorsBySlug = new Map(team.map((member) => [`team/${member.slug}.json`, member]))

  return (
    <>
      {sections.map((section, index) => {
        if (typeof section._template !== 'string') {
          return null
        }

        const key = `${section._template}-${index}`

        switch (section._template) {
          case 'heroSection':
            return <HeroSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'heroSection' }>)} />
          case 'textSection':
            return <TextSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'textSection' }>)} />
          case 'ctaSection':
            return <CtaSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'ctaSection' }>)} />
          case 'quoteSection':
            return <QuoteSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'quoteSection' }>)} />
          case 'featureHighlightSection':
            return (
              <FeatureHighlightSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'featureHighlightSection' }>)}
              />
            )
          case 'featuredItemsSection':
            return (
              <FeaturedItemsSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'featuredItemsSection' }>)}
              />
            )
          case 'testimonialsSection':
            return (
              <TestimonialsSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'testimonialsSection' }>)}
              />
            )
          case 'featuredPeopleSection':
            return (
              <FeaturedPeopleSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'featuredPeopleSection' }>)}
                resolvedPeople={resolvePeople(section.people, team)}
              />
            )
          case 'faqSection':
            return <FaqSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'faqSection' }>)} />
          case 'mediaGallerySection':
            return (
              <MediaGallerySection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'mediaGallerySection' }>)}
              />
            )
          case 'contactSection':
            return (
              <ContactSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'contactSection' }>)}
              />
            )
          case 'recentPostsSection':
            return (
              <RecentPostsSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'recentPostsSection' }>)}
                posts={selectRecentPosts(
                  posts,
                  typeof section.recentCount === 'number' ? section.recentCount : undefined,
                  currentPostSlug,
                )}
                authorsBySlug={authorsBySlug}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

async function getSectionTeam(): Promise<SectionTeamMember[]> {
  const members = await getTeam()
  return members.map((member) => ({
    firstName: stringOrUndefined(member.firstName),
    lastName: stringOrUndefined(member.lastName),
    role: stringOrUndefined(member.role),
    bio: stringOrUndefined(member.bio),
    image: isRecord(member.image) ? member.image : undefined,
    slug: stringOrUndefined(member.slug),
  }))
}

async function getSectionPosts(): Promise<SectionPostSummary[]> {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    title: stringOrUndefined(post.title),
    slug: stringOrUndefined(post.slug),
    date: stringOrUndefined(post.date),
    excerpt: stringOrUndefined(post.excerpt),
    author: stringOrUndefined(post.author),
    featuredImage: isRecord(post.featuredImage) ? post.featuredImage : undefined,
  }))
}

function resolvePeople(
  references: unknown,
  team: SectionTeamMember[],
): SectionTeamMember[] {
  if (!Array.isArray(references)) {
    return []
  }

  const byReference = new Map(team.map((member) => [`team/${member.slug}.json`, member]))

  return references
    .map((reference) => {
      if (!isRecord(reference) || typeof reference.person !== 'string') {
        return null
      }

      return byReference.get(reference.person) ?? null
    })
    .filter((member): member is SectionTeamMember => member !== null)
}

function selectRecentPosts(posts: SectionPostSummary[], count = 3, currentPostSlug?: string): SectionPostSummary[] {
  return posts.filter((post) => post.slug && post.slug !== currentPostSlug).slice(0, count)
}

function stringOrUndefined(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
