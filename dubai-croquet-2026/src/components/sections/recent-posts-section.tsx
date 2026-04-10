import Link from 'next/link'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentPostsSectionData, SectionPostSummary, SectionTeamMember } from '@/components/sections/types'

type RecentPostsSectionProps = RecentPostsSectionData & {
  posts?: SectionPostSummary[]
  authorsBySlug?: Map<string, SectionTeamMember>
}

export function RecentPostsSection({
  colors,
  width,
  title,
  subtitle,
  showDate,
  showAuthor,
  showExcerpt,
  actions,
  posts = [],
  authorsBySlug = new Map<string, SectionTeamMember>(),
}: RecentPostsSectionProps) {
  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-10">
        {(title || subtitle || (actions?.length ?? 0) > 0) && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
              {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
            </div>
            <SectionActions actions={actions} className="sm:justify-end" />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const href = post.slug ? `/blog/${post.slug}` : '#'
            const author = post.author ? authorsBySlug.get(normalizeReference(post.author)) : undefined
            const authorName = author ? [author.firstName, author.lastName].filter(Boolean).join(' ').trim() : undefined

            return (
              <Card key={post.slug ?? post.title} className="rounded-none border border-border/60 bg-background/30 py-0">
                <CardHeader className="space-y-3 px-6 pt-6">
                  {(showDate || showAuthor) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm uppercase tracking-[0.14em] text-muted-foreground">
                      {showDate && post.date ? <span>{formatPostDate(post.date)}</span> : null}
                      {showAuthor && authorName ? <span>{authorName}</span> : null}
                    </div>
                  )}
                  {post.title ? (
                    <CardTitle className="font-display text-3xl leading-tight">
                      <Link href={href} className="transition-opacity hover:opacity-75">
                        {post.title}
                      </Link>
                    </CardTitle>
                  ) : null}
                </CardHeader>
                {showExcerpt && post.excerpt ? (
                  <CardContent className="px-6 pb-6 text-base leading-8 text-muted-foreground">
                    <p>{post.excerpt}</p>
                  </CardContent>
                ) : null}
              </Card>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}

function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function normalizeReference(value: string) {
  return value.replace(/^\/+/, '')
}
