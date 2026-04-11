import Image from 'next/image'
import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
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
          <div className="space-y-4 text-center">
            <div className="mx-auto max-w-3xl space-y-4">
              {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
              {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
            </div>
            <SectionActions actions={actions} className="justify-center" />
          </div>
        )}

        <div
          className={cn(
            'grid gap-6',
            columns <= 1 ? 'grid-cols-1' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {visibleItems.map((item, index) => (
            <article key={`${item.title ?? 'item'}-${index}`} className="space-y-5 text-center">
              {item.featuredImage?.src ? (
                <div className="mx-auto max-w-52">
                  <Image
                    src={item.featuredImage.src}
                    alt={item.featuredImage.alt ?? item.title ?? 'Dubai Croquet Club'}
                    width={960}
                    height={720}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                {item.subtitle ? (
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{item.subtitle}</p>
                ) : null}
                {item.title ? <h3 className="font-display text-3xl leading-tight">{item.title}</h3> : null}
              </div>
              {item.text ? (
                <div className="mx-auto max-w-md">
                  <Markdown content={item.text} />
                </div>
              ) : null}
              <div className="pt-2">
                <SectionActions actions={item.actions} className="justify-center" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
