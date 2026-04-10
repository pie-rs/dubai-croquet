import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import type { HeroSectionData } from '@/components/sections/types'

export function HeroSection({
  colors,
  width,
  title,
  subtitle,
  badgeLabel,
  text,
  actions,
  media,
}: HeroSectionData) {
  const hasMedia = Boolean(media?.src)

  return (
    <SectionShell colors={colors} width={width}>
      <div className={`grid items-center gap-10 ${hasMedia ? 'lg:grid-cols-[minmax(0,1fr)_minmax(20rem,34rem)]' : 'max-w-3xl'}`}>
        <div className="space-y-5">
          {badgeLabel ? (
            <Badge variant="outline" className="rounded-none border-current bg-transparent px-3 py-1 uppercase">
              {badgeLabel}
            </Badge>
          ) : null}
          {title ? <h2 className="font-display text-5xl leading-none md:text-6xl">{title}</h2> : null}
          {subtitle ? <p className="text-xl leading-8 text-muted-foreground">{subtitle}</p> : null}
          <Markdown content={text} />
          <SectionActions actions={actions} className="pt-2" />
        </div>
        {media?.src ? (
          <div className="space-y-3">
            <Image
              src={media.src}
              alt={media.alt ?? title ?? 'Dubai Croquet Club'}
              width={960}
              height={720}
              className="h-auto w-full border border-border object-cover"
            />
            {media.caption ? <p className="text-sm text-muted-foreground">{media.caption}</p> : null}
          </div>
        ) : null}
      </div>
    </SectionShell>
  )
}
