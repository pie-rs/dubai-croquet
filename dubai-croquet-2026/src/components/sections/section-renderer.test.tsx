/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeatureHighlightSection } from '@/components/sections/feature-highlight-section'
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
            _template: 'notBuiltYet',
            title: 'Ignored',
          },
        ]}
      />,
    )

    expect(screen.getByText(/one may know how to conquer/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Game on' })).toHaveAttribute('href', '/events')
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
  })
})
