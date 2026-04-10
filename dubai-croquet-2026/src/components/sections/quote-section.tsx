import { SectionShell } from '@/components/sections/section-shell'
import type { QuoteSectionData } from '@/components/sections/types'

export function QuoteSection({ colors, width, quote, name, title }: QuoteSectionData) {
  return (
    <SectionShell colors={colors} width={width} className="text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        {quote ? <blockquote className="font-display text-4xl leading-tight md:text-5xl">{quote}</blockquote> : null}
        {name || title ? (
          <div className="space-y-1 text-sm uppercase tracking-[0.16em] text-muted-foreground">
            {name ? <p>{name}</p> : null}
            {title ? <p>{title}</p> : null}
          </div>
        ) : null}
      </div>
    </SectionShell>
  )
}
