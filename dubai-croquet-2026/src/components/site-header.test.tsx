/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SiteHeader } from '@/components/site-header'

afterEach(() => {
  cleanup()
})

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

describe('SiteHeader', () => {
  it('renders the preserved navigation and title', () => {
    render(
      <SiteHeader
        title="Dubai Croquet Club"
        isTitleVisible
        logo={{ src: '/images/dlcc-logo.webp', alt: 'Dubai Croquet Club' }}
        links={[
          { label: 'Home', url: '/' },
          { label: 'The Game', url: '/the-game' },
          { label: 'FAQ', url: '/faq' },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: /dubai croquet club/i })).toHaveAttribute('href', '/')
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('The Game').length).toBeGreaterThan(0)
    expect(screen.getAllByText('FAQ').length).toBeGreaterThan(0)
  })

  it('opens and closes the mobile menu', () => {
    render(
      <SiteHeader
        title="Dubai Croquet Club"
        isTitleVisible
        links={[
          { label: 'Events', url: '/events' },
          { label: 'Contact Us', url: '/contact-us' },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByText('Events').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
