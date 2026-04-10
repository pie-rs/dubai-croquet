/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeatureHighlightSection } from '@/components/sections/feature-highlight-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FaqSection } from '@/components/sections/faq-section'
import { MediaGallerySection } from '@/components/sections/media-gallery-section'
import { SectionRenderer } from '@/components/sections/section-renderer'
import { TextSection } from '@/components/sections/text-section'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={typeof props.alt === 'string' ? props.alt : ''} {...props} />
  ),
}))

afterEach(() => {
  cleanup()
})

describe('narrative sections', () => {
  it('renders feature highlights with badge, action, and media', () => {
    render(
      <FeatureHighlightSection
        _template="featureHighlightSection"
        colors="colors-a"
        width="wide"
        title="Who Is Behind The Dubai Croquet Club?"
        badgeLabel="Serious. professional. sportspeople."
        text="Founding the club took WhatsApp voice notes."
        media={{ src: '/images/ben-running.jpg', alt: 'Hero image' }}
        actions={[{ label: 'Sign Up', url: '/contact-us', style: 'primary' }]}
      />,
    )

    expect(screen.getByText('Serious. professional. sportspeople.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /who is behind/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/contact-us')
    expect(screen.getByAltText('Hero image')).toBeInTheDocument()
  })

  it('renders text sections with markdown and raw html preserved', () => {
    render(
      <TextSection
        _template="textSection"
        colors="colors-a"
        width="narrow"
        title="A Short Introduction"
        body={'### General\n\n[Croquet](https://example.com) tactics.\n\n<div>Centered callout</div>'}
      />,
    )

    expect(screen.getByRole('heading', { name: 'A Short Introduction' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'General' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Croquet' })).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('Centered callout')).toBeInTheDocument()
  })

  it('renders faq sections as an accordion', () => {
    render(
      <FaqSection
        _template="faqSection"
        colors="colors-a"
        width="wide"
        title="Need Answers?"
        items={[
          { question: 'Can I become a multimillionaire?', answer: 'Probably not.' },
          { question: 'Is croquet hard to pick up?', answer: 'Have you seen our captain?' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Need Answers?' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Can I become a multimillionaire?' }))

    expect(screen.getByText('Probably not.')).toBeInTheDocument()
  })

  it('renders media galleries as image grids', () => {
    render(
      <MediaGallerySection
        _template="mediaGallerySection"
        colors="colors-h"
        width="wide"
        title="Gallery"
        subtitle="Some Dubai Croquet Club Memories"
        images={[
          { src: '/images/example-1.jpg', alt: 'First image', caption: 'First caption' },
          { src: '/images/example-2.jpg', alt: 'Second image' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByText('Some Dubai Croquet Club Memories')).toBeInTheDocument()
    expect(screen.getByAltText('First image')).toBeInTheDocument()
    expect(screen.getByText('First caption')).toBeInTheDocument()
  })

  it('renders contact sections with the correct form variant', () => {
    render(
      <ContactSection
        _template="contactSection"
        colors="colors-h"
        width="wide"
        title="Contact us"
        text="We look forward to hearing from you."
        formKey="contact"
        variant="variant-a"
        media={{ src: '/images/strategy-under-the-tree.jpg', alt: 'Contact form image' }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Contact us' })).toBeInTheDocument()
    expect(screen.getByText('We look forward to hearing from you.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
    expect(screen.getByAltText('Contact form image')).toBeInTheDocument()
  })

  it('dispatches supported sections and ignores unknown templates', () => {
    render(
      <SectionRenderer
        sections={[
          {
            _template: 'quoteSection',
            quote: '"One may know how to conquer without being able to do it"',
            name: 'Sun Tzu',
            title: 'The Art Of War',
          },
          {
            _template: 'ctaSection',
            title: "Let's do this",
            text: 'Take me to your lawn...',
            actions: [{ label: 'Game on', url: '/events', style: 'primary' }],
          },
          {
            _template: 'faqSection',
            title: 'Need Answers?',
            items: [{ question: 'Question?', answer: 'Answer.' }],
          },
          {
            _template: 'mediaGallerySection',
            title: 'Gallery',
            images: [{ src: '/images/example-1.jpg', alt: 'First image' }],
          },
          {
            _template: 'contactSection',
            title: 'Contact us',
            text: 'We look forward to hearing from you.',
            formKey: 'newsletter',
          },
          {
            _template: 'notBuiltYet',
            title: 'Ignored',
          },
        ]}
      />,
    )

    expect(screen.getByText(/one may know how to conquer/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Game on' })).toHaveAttribute('href', '/events')
    expect(screen.getByText('Question?')).toBeInTheDocument()
    expect(screen.getByAltText('First image')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
  })
})
