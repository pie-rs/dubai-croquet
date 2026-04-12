// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BlogPostPage, {
  generateMetadata as generateBlogMetadata,
  generateStaticParams as generateBlogStaticParams,
} from '@/app/(public)/blog/[slug]/page'
import PublicContentPage, {
  generateMetadata as generatePageMetadata,
  generateStaticParams as generatePageStaticParams,
} from '@/app/(public)/[[...slug]]/page'

const {
  mockedNotFound,
  mockedGetAllPages,
  mockedGetPage,
  mockedGetAllPosts,
  mockedGetPost,
  mockedGetTeam,
  mockedSectionRenderer,
  mockedMarkdown,
} = vi.hoisted(() => ({
  mockedNotFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  mockedGetAllPages: vi.fn(),
  mockedGetPage: vi.fn(),
  mockedGetAllPosts: vi.fn(),
  mockedGetPost: vi.fn(),
  mockedGetTeam: vi.fn(),
  mockedSectionRenderer: vi.fn(({ sections }) => <div data-testid="section-renderer">{sections.length}</div>),
  mockedMarkdown: vi.fn(({ content }: { content?: string }) => <div data-testid="markdown">{content}</div>),
}))

vi.mock('next/navigation', () => ({
  notFound: mockedNotFound,
}))

vi.mock('@/lib/tina', () => ({
  getAllPages: mockedGetAllPages,
  getPage: mockedGetPage,
  getAllPosts: mockedGetAllPosts,
  getPost: mockedGetPost,
  getTeam: mockedGetTeam,
}))

vi.mock('@/components/sections/section-renderer', () => ({
  SectionRenderer: mockedSectionRenderer,
}))

vi.mock('@/components/markdown', () => ({
  Markdown: mockedMarkdown,
}))

describe('public route contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds static params for content pages including the homepage', async () => {
    mockedGetAllPages.mockResolvedValue([{ slug: '' }, { slug: 'faq' }, { slug: 'termsandconditions' }])

    await expect(generatePageStaticParams()).resolves.toEqual([
      {},
      { slug: ['faq'] },
      { slug: ['termsandconditions'] },
    ])
  })

  it('loads a content page by slug and forwards sections to the renderer', async () => {
    mockedGetPage.mockResolvedValue({
      title: 'FAQ',
      sections: [{ _template: 'faqSection', title: 'Need Answers?' }],
    })

    render(await PublicContentPage({ params: Promise.resolve({ slug: ['faq'] }) }))

    expect(mockedGetPage).toHaveBeenCalledWith('faq')
    expect(mockedSectionRenderer).toHaveBeenCalledWith({ sections: [{ _template: 'faqSection', title: 'Need Answers?' }] }, undefined)
    expect(screen.getByTestId('section-renderer')).toHaveTextContent('1')
  })

  it('returns page metadata from seo fields when present', async () => {
    mockedGetPage.mockResolvedValue({
      title: 'FAQ',
      seoTitle: 'Croquet FAQ',
      seoDescription: 'Answers for future mallet legends.',
    })

    await expect(generatePageMetadata({ params: Promise.resolve({ slug: ['faq'] }) })).resolves.toEqual({
      title: 'Croquet FAQ',
      description: 'Answers for future mallet legends.',
    })
  })

  it('builds static params for blog posts', async () => {
    mockedGetAllPosts.mockResolvedValue([{ slug: 'post-three' }, { slug: 'post-four' }])

    await expect(generateBlogStaticParams()).resolves.toEqual([{ slug: 'post-three' }, { slug: 'post-four' }])
  })

  it('renders a blog post with date, author, markdown body, and bottom sections', async () => {
    mockedGetPost.mockResolvedValue({
      title: 'The Inaugural Dubai Croquet Session',
      slug: 'post-four',
      date: '2021-04-10',
      author: 'team/desmond-eagle.json',
      body: 'Croquet kicks off.',
      bottomSections: [{ _template: 'recentPostsSection', title: 'Read next' }],
    })
    mockedGetTeam.mockResolvedValue([{ slug: 'desmond-eagle', firstName: 'Piers', lastName: 'S' }])

    render(await BlogPostPage({ params: Promise.resolve({ slug: 'post-four' }) }))

    expect(screen.getByRole('heading', { name: 'The Inaugural Dubai Croquet Session' })).toBeInTheDocument()
    expect(screen.getByText('April 10, 2021')).toBeInTheDocument()
    expect(screen.getByText('By Piers S')).toBeInTheDocument()
    expect(screen.getByTestId('markdown')).toHaveTextContent('Croquet kicks off.')
    expect(mockedSectionRenderer).toHaveBeenCalledWith(
      { sections: [{ _template: 'recentPostsSection', title: 'Read next' }], currentPostSlug: 'post-four' },
      undefined,
    )
  })

  it('returns blog metadata from post title and excerpt', async () => {
    mockedGetPost.mockResolvedValue({
      title: 'Post Three',
      excerpt: 'What to wear this croquet season',
    })

    await expect(generateBlogMetadata({ params: Promise.resolve({ slug: 'post-three' }) })).resolves.toEqual({
      title: 'Post Three',
      description: 'What to wear this croquet season',
    })
  })

  it('calls notFound when a page or post is missing', async () => {
    mockedGetPage.mockResolvedValue(null)
    mockedGetPost.mockResolvedValue(null)

    await expect(PublicContentPage({ params: Promise.resolve({ slug: ['missing'] }) })).rejects.toThrow('NEXT_NOT_FOUND')
    await expect(BlogPostPage({ params: Promise.resolve({ slug: 'missing-post' }) })).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockedNotFound).toHaveBeenCalledTimes(2)
  })
})
