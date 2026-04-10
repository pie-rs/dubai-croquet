import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import type { CtaSectionData } from '@/components/sections/types'

export function CtaSection({ colors, width, title, text, actions }: CtaSectionData) {
  return (
    <SectionShell colors={colors} width={width} className="text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
        <Markdown content={text} />
        <SectionActions actions={actions} className="justify-center pt-2" />
      </div>
    </SectionShell>
  )
}
