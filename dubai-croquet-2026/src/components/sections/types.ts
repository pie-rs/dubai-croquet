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

export type SectionPersonReference = {
  person?: string
}

export type SectionTeamMember = {
  firstName?: string
  lastName?: string
  role?: string
  bio?: string
  image?: SectionImage
  slug?: string
}

export type SectionFeaturedItem = {
  title?: string
  subtitle?: string
  text?: string
  featuredImage?: SectionImage
  actions?: SectionAction[]
}

export type SectionTestimonial = {
  quote?: string
  name?: string
  title?: string
  image?: SectionImage
}

export type SectionPostSummary = {
  title?: string
  slug?: string
  date?: string
  excerpt?: string
  author?: string
  featuredImage?: SectionImage
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

export type FaqSectionItem = {
  question?: string
  answer?: string
}

export type FaqSectionData = {
  _template: 'faqSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  items?: FaqSectionItem[]
}

export type MediaGallerySectionData = {
  _template: 'mediaGallerySection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  images?: SectionImage[]
}

export type ContactSectionData = {
  _template: 'contactSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  text?: string
  formKey?: 'contact' | 'newsletter' | 'registration'
  variant?: string
  media?: SectionImage
}

export type FeaturedItemsSectionData = {
  _template: 'featuredItemsSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  columns?: number
  actions?: SectionAction[]
  items?: SectionFeaturedItem[]
}

export type TestimonialsSectionData = {
  _template: 'testimonialsSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  variant?: string
  testimonials?: SectionTestimonial[]
}

export type FeaturedPeopleSectionData = {
  _template: 'featuredPeopleSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  variant?: string
  actions?: SectionAction[]
  people?: SectionPersonReference[]
}

export type RecentPostsSectionData = {
  _template: 'recentPostsSection'
  colors?: string
  width?: string
  title?: string
  subtitle?: string
  variant?: string
  recentCount?: number
  showDate?: boolean
  showAuthor?: boolean
  showExcerpt?: boolean
  actions?: SectionAction[]
}

export type NarrativeSection =
  | HeroSectionData
  | TextSectionData
  | CtaSectionData
  | QuoteSectionData
  | FeatureHighlightSectionData
  | FaqSectionData
  | MediaGallerySectionData
  | ContactSectionData
  | FeaturedItemsSectionData
  | TestimonialsSectionData
  | FeaturedPeopleSectionData
  | RecentPostsSectionData
