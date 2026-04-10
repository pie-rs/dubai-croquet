import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'
import { SectionRenderer } from '@/components/sections/section-renderer'
import { getAllPosts, getPost, getTeam } from '@/lib/tina'

type BlogPostPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const author = await getAuthor(typeof post.author === 'string' ? post.author : undefined)
  const authorName = author ? [author.firstName, author.lastName].filter(Boolean).join(' ').trim() : undefined

  return (
    <>
      <article className="colors-a">
        <div className="content-width px-4 py-16 md:px-6 md:py-24">
          <header className="mx-auto mb-12 max-w-3xl space-y-5 text-center">
            {typeof post.date === 'string' ? (
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{formatPostDate(post.date)}</p>
            ) : null}
            {typeof post.title === 'string' ? <h1 className="font-display text-5xl leading-none md:text-7xl">{post.title}</h1> : null}
            {authorName ? <p className="text-base text-muted-foreground">By {authorName}</p> : null}
          </header>
          <div className="mx-auto max-w-3xl">
            <Markdown content={typeof post.body === 'string' ? post.body : ''} className="text-foreground" />
          </div>
        </div>
      </article>
      <SectionRenderer sections={toSectionRecords(post.bottomSections)} currentPostSlug={slug} />
    </>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts
    .map((post) => (typeof post.slug === 'string' ? post.slug : ''))
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {}
  }

  return {
    title: typeof post.title === 'string' ? post.title : undefined,
    description: typeof post.excerpt === 'string' ? post.excerpt : undefined,
  }
}

async function getAuthor(reference?: string) {
  if (!reference) {
    return null
  }

  const team = await getTeam()
  const normalized = reference.replace(/^\/+/, '')

  return (
    team.find((member) => `team/${String(member.slug ?? '')}.json` === normalized) ?? null
  )
}

function toSectionRecords(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isRecord)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
