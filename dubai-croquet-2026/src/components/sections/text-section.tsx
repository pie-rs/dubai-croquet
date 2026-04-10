import { Markdown } from '@/components/markdown'
import { SectionShell } from '@/components/sections/section-shell'
import type { TextSectionData } from '@/components/sections/types'

export function TextSection({ colors, width, title, subtitle, body }: TextSectionData) {
  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-5">
        {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
        {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
        <Markdown content={body} />
      </div>
    </SectionShell>
  )
}
