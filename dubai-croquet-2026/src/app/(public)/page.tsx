import { notFound } from 'next/navigation'
import { SectionRenderer } from '@/components/sections/section-renderer'
import { getPage } from '@/lib/tina'

export default async function PublicHomePage() {
  const page = await getPage('/')
  if (!page) {
    notFound()
  }

  const sections = Array.isArray(page.sections) ? page.sections : []
  return <SectionRenderer sections={sections.filter(isRecord)} />
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
