import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/tina'

export default async function PublicHomePage() {
  const page = await getPage('/')
  if (!page) {
    notFound()
  }

  const sections = Array.isArray(page.sections) ? page.sections : []
  const hero = sections.find(isRecord)
  const intro = sections.find((section) => isRecord(section) && section._template === 'textSection')
  const actions = hero && Array.isArray(hero.actions) ? hero.actions.filter(isRecord) : []

  return (
    <div className="bg-background">
      <section className="mx-auto flex min-h-[70vh] max-w-content flex-col justify-center gap-8 px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Dubai Croquet Club
          </p>
          <h1 className="font-display text-5xl leading-none text-foreground md:text-7xl">
            {typeof hero?.title === 'string'
              ? hero.title
              : typeof page.title === 'string'
                ? page.title
                : 'Dubai Croquet Club'}
          </h1>
          {typeof hero?.subtitle === 'string' ? (
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-2xl">
              {hero.subtitle}
            </p>
          ) : null}
          {typeof intro?.body === 'string' ? (
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">{intro.body}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {actions.map((action) => (
            <Link
              key={`${String(action.url)}-${String(action.label)}`}
              href={String(action.url)}
              className="inline-flex items-center justify-center rounded-none bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {String(action.label)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
