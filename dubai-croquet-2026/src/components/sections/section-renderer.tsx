import { CtaSection } from '@/components/sections/cta-section'
import { FeatureHighlightSection } from '@/components/sections/feature-highlight-section'
import { HeroSection } from '@/components/sections/hero-section'
import { QuoteSection } from '@/components/sections/quote-section'
import { TextSection } from '@/components/sections/text-section'
import type { NarrativeSection } from '@/components/sections/types'

type SectionRendererProps = {
  sections: Array<Record<string, unknown>>
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        if (typeof section._template !== 'string') {
          return null
        }

        const key = `${section._template}-${index}`

        switch (section._template) {
          case 'heroSection':
            return <HeroSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'heroSection' }>)} />
          case 'textSection':
            return <TextSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'textSection' }>)} />
          case 'ctaSection':
            return <CtaSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'ctaSection' }>)} />
          case 'quoteSection':
            return <QuoteSection key={key} {...(section as unknown as Extract<NarrativeSection, { _template: 'quoteSection' }>)} />
          case 'featureHighlightSection':
            return (
              <FeatureHighlightSection
                key={key}
                {...(section as unknown as Extract<NarrativeSection, { _template: 'featureHighlightSection' }>)}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
