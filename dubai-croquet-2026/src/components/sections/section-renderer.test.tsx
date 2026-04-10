/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatureHighlightSection } from '@/components/sections/feature-highlight-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FeaturedItemsSection } from '@/components/sections/featured-items-section'
import { FeaturedPeopleSection } from '@/components/sections/featured-people-section'
import { FaqSection } from '@/components/sections/faq-section'
import { MediaGallerySection } from '@/components/sections/media-gallery-section'
import { RecentPostsSection } from '@/components/sections/recent-posts-section'
import { SectionRenderer } from '@/components/sections/section-renderer'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { TextSection } from '@/components/sections/text-section'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/lib/tina', () => ({
  getAllPosts: vi.fn(async () => [
    {
      title: 'First Post',
      slug: 'first-post',
      date: '2021-04-10',
      excerpt: 'Dubai Croquet kicks off its inaugural session',
      author: 'team/desmond-eagle.json',
    },
    {
      title: 'Second Post',
      slug: 'second-post',
      date: '2021-06-01',
      excerpt: 'What to wear this croquet season',
      author: 'team/person-b7rybasni.json',
    },
  ]),
  getTeam: vi.fn(async () => [
    {
      slug: 'desmond-eagle',
      firstName: 'Piers',
      lastName: 'S',
      role: 'Captain',
      bio: 'Generally general.',
      image: { src: '/images/the-captain.jpg', alt: 'The captain' },
    },
    {
      slug: 'person-b7rybasni',
      firstName: 'Maz',
      lastName: 'G',
      role: 'Mallet Monster',
      bio: 'Small but mighty.',
      image: { src: '/images/maz.jpg', alt: 'Maz' },
    },
  ]),
}))

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={typeof props.alt === 'string' ? props.alt : ''} {...props} />
  ),
}))

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  vi.restoreAllMocks()
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

  it('submits newsletter forms to the matching api route', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Added to the list.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <ContactSection
        _template="contactSection"
        colors="colors-f"
        width="wide"
        title="Newsletter"
        text="Sign up now."
        formKey="newsletter"
      />,
    )

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'hello@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hello@example.com' }),
      }),
    )

    expect(await screen.findByText('Added to the list.')).toBeInTheDocument()
  })

  it('renders featured items with images and calls to action', () => {
    render(
      <FeaturedItemsSection
        _template="featuredItemsSection"
        title="Why Play Croquet?"
        columns={3}
        items={[
          {
            title: 'Better Looking',
            subtitle: 'Immediately',
            text: 'You will become more attractive.',
            featuredImage: { src: '/images/faster.svg', alt: 'Faster' },
            actions: [{ label: 'Tell me more', url: '/the-game', style: 'link' }],
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Why Play Croquet?' })).toBeInTheDocument()
    expect(screen.getByAltText('Faster')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tell me more' })).toHaveAttribute('href', '/the-game')
  })

  it('renders testimonials and featured people sections', () => {
    render(
      <>
        <TestimonialsSection
          _template="testimonialsSection"
          testimonials={[
            {
              quote: '"We dress up to discuss our game plan"',
              name: 'Cate Blanchett & Leonardo Di Caprio',
              title: 'Strategy unit',
              image: { src: '/images/leo.jpg', alt: 'Strategy duo' },
            },
          ]}
        />
        <FeaturedPeopleSection
          _template="featuredPeopleSection"
          title="About us"
          resolvedPeople={[
            {
              slug: 'desmond-eagle',
              firstName: 'Piers',
              lastName: 'S',
              role: 'Captain',
              bio: 'Generally general.',
              image: { src: '/images/the-captain.jpg', alt: 'The captain' },
            },
          ]}
        />
      </>,
    )

    expect(screen.getByText(/we dress up to discuss our game plan/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About us' })).toBeInTheDocument()
    expect(screen.getByText('Captain')).toBeInTheDocument()
  })

  it('renders recent posts with post metadata', () => {
    render(
      <RecentPostsSection
        _template="recentPostsSection"
        title="Read next"
        posts={[
          {
            title: 'First Post',
            slug: 'first-post',
            date: '2021-04-10',
            excerpt: 'Dubai Croquet kicks off its inaugural session',
            author: 'team/desmond-eagle.json',
          },
        ]}
        authorsBySlug={
          new Map([
            [
              'team/desmond-eagle.json',
              {
                slug: 'desmond-eagle',
                firstName: 'Piers',
                lastName: 'S',
              },
            ],
          ])
        }
        showDate
        showAuthor
        showExcerpt
      />,
    )

    expect(screen.getByRole('heading', { name: 'Read next' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'First Post' })).toHaveAttribute('href', '/blog/first-post')
    expect(screen.getByText('10 April 2021')).toBeInTheDocument()
    expect(screen.getByText('Piers S')).toBeInTheDocument()
    expect(screen.getByText('Dubai Croquet kicks off its inaugural session')).toBeInTheDocument()
  })

  it('dispatches supported sections and ignores unknown templates', async () => {
    render(
      await SectionRenderer({
        currentPostSlug: 'second-post',
        sections: [
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
            _template: 'featuredItemsSection',
            title: 'Why play?',
            items: [{ title: 'Better Looking', text: 'Obviously.' }],
          },
          {
            _template: 'testimonialsSection',
            testimonials: [{ quote: '"Still undefeated"', name: 'The Captain' }],
          },
          {
            _template: 'featuredPeopleSection',
            title: 'About us',
            people: [{ person: 'team/desmond-eagle.json' }],
          },
          {
            _template: 'recentPostsSection',
            title: 'Read next',
            recentCount: 2,
            showDate: true,
            showAuthor: true,
            showExcerpt: true,
          },
          {
            _template: 'notBuiltYet',
            title: 'Ignored',
          },
        ],
      }),
    )

    expect(screen.getByText(/one may know how to conquer/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Game on' })).toHaveAttribute('href', '/events')
    expect(screen.getByText('Question?')).toBeInTheDocument()
    expect(screen.getByAltText('First image')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByText('Better Looking')).toBeInTheDocument()
    expect(screen.getByText(/still undefeated/i)).toBeInTheDocument()
    expect(screen.getByText('Generally general.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'First Post' })).toHaveAttribute('href', '/blog/first-post')
    expect(screen.queryByText('Second Post')).not.toBeInTheDocument()
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
  })
})
