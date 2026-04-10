import Image from 'next/image'
import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FeaturedItemsSectionData } from '@/components/sections/types'

export function FeaturedItemsSection({
  colors,
  width,
  title,
  subtitle,
  columns = 3,
  actions,
  items = [],
}: FeaturedItemsSectionData) {
  const visibleItems = items.filter((item) => item.title || item.text || item.featuredImage?.src)

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

        <div
          className={cn(
            'grid gap-6',
            columns <= 1 ? 'grid-cols-1' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {visibleItems.map((item, index) => (
            <Card key={`${item.title ?? 'item'}-${index}`} className="rounded-none border border-border/60 bg-background/40 py-0">
              {item.featuredImage?.src ? (
                <div className="border-b border-border/60">
                  <Image
                    src={item.featuredImage.src}
                    alt={item.featuredImage.alt ?? item.title ?? 'Dubai Croquet Club'}
                    width={960}
                    height={720}
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : null}
              <CardHeader className="space-y-2 px-6 pt-6">
                {item.subtitle ? (
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{item.subtitle}</p>
                ) : null}
                {item.title ? <CardTitle className="font-display text-3xl leading-tight">{item.title}</CardTitle> : null}
              </CardHeader>
              {item.text ? (
                <CardContent className="px-6 pb-6">
                  <Markdown content={item.text} />
                </CardContent>
              ) : null}
              <div className="px-6 pb-6 pt-2">
                <SectionActions actions={item.actions} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
