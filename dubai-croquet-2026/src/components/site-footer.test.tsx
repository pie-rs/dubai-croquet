/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SiteFooter } from '@/components/site-footer'

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

describe('SiteFooter', () => {
  it('renders contact, legal, and social links from site config', () => {
    render(
      <SiteFooter
        title="Dubai Croquet Club"
        logo={{ src: '/images/DCC-LOGO-COLOUR.svg', alt: 'Dubai Croquet Club Logo' }}
        contacts={{
          phoneNumber: '+971 50 760 8210',
          email: 'hello@dubaicroquet.com',
        }}
        primaryLinks={[{ label: 'Links', url: '/links' }]}
        legalLinks={[{ label: 'Terms & Conditions', url: '/termsandconditions' }]}
        socialLinks={[{ label: 'Instagram', url: 'https://www.instagram.com/dubaicroquet/' }]}
        copyrightText="Copyright Dubai Croquet Club 2023"
      />,
    )

    expect(screen.getByText('+971 50 760 8210')).toBeInTheDocument()
    expect(screen.getByText('hello@dubaicroquet.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Links' })).toHaveAttribute('href', '/links')
    expect(screen.getByRole('link', { name: 'Terms & Conditions' })).toHaveAttribute(
      'href',
      '/termsandconditions',
    )
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/dubaicroquet/',
    )
    expect(screen.getByText('Copyright Dubai Croquet Club 2023')).toBeInTheDocument()
  })
})
