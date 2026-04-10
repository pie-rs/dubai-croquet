import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SectionRenderer } from '@/components/sections/section-renderer'
import { getAllPages, getPage } from '@/lib/tina'

type PublicPageProps = {
  params: Promise<{ slug?: string[] }> | { slug?: string[] }
}

export default async function PublicContentPage({ params }: PublicPageProps) {
  const { slug } = await params
  const page = await getPage(normalizeSegments(slug))

  if (!page) {
    notFound()
  }

  return <SectionRenderer sections={toSectionRecords(page.sections)} />
}

export async function generateStaticParams() {
  const pages = await getAllPages()

  return pages
    .map((page) => (typeof page.slug === 'string' ? page.slug : ''))
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(normalizeSegments(slug))

  if (!page) {
    return {}
  }

  const title = typeof page.seoTitle === 'string' ? page.seoTitle : typeof page.title === 'string' ? page.title : undefined
  const description = typeof page.seoDescription === 'string' ? page.seoDescription : undefined

  return {
    title,
    description,
  }
}

function normalizeSegments(slug?: string[]) {
  return Array.isArray(slug) ? slug.join('/') : '/'
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
