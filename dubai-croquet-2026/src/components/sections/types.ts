export type SectionAction = {
  label?: string
  url?: string
  style?: string
}

export type SectionImage = {
  src?: string
  alt?: string
  caption?: string
}

export type HeroSectionData = {
  _template: 'heroSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  badgeLabel?: string
  text?: string
  actions?: SectionAction[]
  media?: SectionImage
}

export type TextSectionData = {
  _template: 'textSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  body?: string
}

export type CtaSectionData = {
  _template: 'ctaSection'
  colors?: string
  width?: string
  title?: string
  text?: string
  actions?: SectionAction[]
}

export type QuoteSectionData = {
  _template: 'quoteSection'
  colors?: string
  width?: string
  quote?: string
  name?: string
  title?: string
}

export type FeatureHighlightSectionData = {
  _template: 'featureHighlightSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  badgeLabel?: string
  text?: string
  media?: SectionImage
  actions?: SectionAction[]
}

export type NarrativeSection =
  | HeroSectionData
  | TextSectionData
  | CtaSectionData
  | QuoteSectionData
  | FeatureHighlightSectionData
