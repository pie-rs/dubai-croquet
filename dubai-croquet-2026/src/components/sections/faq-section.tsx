'use client'

import { Markdown } from '@/components/markdown'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionShell } from '@/components/sections/section-shell'
import type { FaqSectionData } from '@/components/sections/types'

function normalizeFaqValue(question: string, index: number) {
  const slug = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `faq-item-${index + 1}`
}

export function FaqSection({ colors, width, title, subtitle, items = [] }: FaqSectionData) {
  const visibleItems = items.filter((item) => item.question && item.answer)

  return (
    <SectionShell colors={colors} width={width}>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
          {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
        </div>

        {visibleItems.length > 0 ? (
          <Accordion defaultValue={[]} className="space-y-0">
            {visibleItems.map((item, index) => {
              const value = normalizeFaqValue(item.question ?? '', index)

              return (
                <AccordionItem key={`${value}-${index}`} value={value} className="border-current/15">
                  <AccordionTrigger className="w-full gap-6 py-5 text-left font-display text-2xl leading-tight md:text-3xl">
                    <span>{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pr-8 pt-0">
                    <Markdown content={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : null}
      </div>
    </SectionShell>
  )
}
