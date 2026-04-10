import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { createTinaContentLoader } from '@/lib/tina-content'

describe('createTinaContentLoader', () => {
  it('loads site config, pages, posts, and team content from a local filesystem tree', async () => {
    await withContentFixture(
      {
        'content/site/config.json': JSON.stringify(
          {
            title: 'Dubai Croquet',
            header: { primaryLinks: [{ label: 'Home', url: '/' }] },
            footer: { copyrightText: '© Dubai Croquet' },
          },
          null,
          2,
        ),
        'content/pages/index.json': JSON.stringify(
          {
            title: 'Home',
            slug: 'index',
            sections: [{ type: 'heroSection', title: 'Welcome' }],
          },
          null,
          2,
        ),
        'content/pages/about-us.json': JSON.stringify(
          {
            title: 'About Us',
            slug: '/about-us/',
            sections: [{ type: 'textSection', title: 'Our Story' }],
          },
          null,
          2,
        ),
        'content/posts/first-post.mdx': [
          '---',
          'title: First Post',
          'slug: /first-post/',
          'date: 2024-02-01',
          'excerpt: First excerpt',
          'featuredImage: /images/first.jpg',
          '---',
          '',
          '# First Post',
          '',
          'Body copy.',
          '',
        ].join('\n'),
        'content/posts/second-post.mdx': [
          '---',
          'title: Second Post',
          'date: 2024-03-01',
          'excerpt: Second excerpt',
          '---',
          '',
          'Second body.',
          '',
        ].join('\n'),
        'content/team/john-doe.json': JSON.stringify(
          {
            firstName: 'John',
            lastName: 'Doe',
            slug: '/john-doe/',
            role: 'Captain',
          },
          null,
          2,
        ),
        'content/team/alex-smith.json': JSON.stringify(
          {
            firstName: 'Alex',
            lastName: 'Smith',
            role: 'Member',
          },
          null,
          2,
        ),
      },
      async (root) => {
        const loader = createTinaContentLoader({ baseDir: root })

        await expect(loader.getSiteConfig()).resolves.toEqual({
          title: 'Dubai Croquet',
          header: { primaryLinks: [{ label: 'Home', url: '/' }] },
          footer: { copyrightText: '© Dubai Croquet' },
        })

        await expect(loader.getPage('/')).resolves.toEqual({
          title: 'Home',
          slug: '',
          sections: [{ type: 'heroSection', title: 'Welcome' }],
        })

        await expect(loader.getPage('/about-us/')).resolves.toEqual({
          title: 'About Us',
          slug: 'about-us',
          sections: [{ type: 'textSection', title: 'Our Story' }],
        })

        await expect(loader.getAllPages()).resolves.toEqual([
          {
            title: 'Home',
            slug: '',
            sections: [{ type: 'heroSection', title: 'Welcome' }],
          },
          {
            title: 'About Us',
            slug: 'about-us',
            sections: [{ type: 'textSection', title: 'Our Story' }],
          },
        ])

        await expect(loader.getPost('first-post')).resolves.toEqual({
          title: 'First Post',
          slug: 'first-post',
          date: '2024-02-01',
          excerpt: 'First excerpt',
          featuredImage: '/images/first.jpg',
          body: '# First Post\n\nBody copy.\n',
        })

        await expect(loader.getAllPosts()).resolves.toEqual([
          {
            title: 'Second Post',
            slug: 'second-post',
            date: '2024-03-01',
            excerpt: 'Second excerpt',
            body: 'Second body.\n',
          },
          {
            title: 'First Post',
            slug: 'first-post',
            date: '2024-02-01',
            excerpt: 'First excerpt',
            featuredImage: '/images/first.jpg',
            body: '# First Post\n\nBody copy.\n',
          },
        ])

        await expect(loader.getTeam()).resolves.toEqual([
          {
            firstName: 'Alex',
            lastName: 'Smith',
            role: 'Member',
            slug: 'alex-smith',
          },
          {
            firstName: 'John',
            lastName: 'Doe',
            slug: 'john-doe',
            role: 'Captain',
          },
        ])
      },
    )
  })

  it('returns null or empty collections when content is missing', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'dubai-croquet-tina-empty-'))
    try {
      const loader = createTinaContentLoader({ baseDir: root })

      await expect(loader.getSiteConfig()).resolves.toBeNull()
      await expect(loader.getPage('missing')).resolves.toBeNull()
      await expect(loader.getPost('missing')).resolves.toBeNull()
      await expect(loader.getAllPages()).resolves.toEqual([])
      await expect(loader.getAllPosts()).resolves.toEqual([])
      await expect(loader.getTeam()).resolves.toEqual([])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

async function withContentFixture(
  files: Record<string, string>,
  run: (root: string) => Promise<void>,
): Promise<void> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dubai-croquet-tina-'))

  try {
    for (const [relativePath, contents] of Object.entries(files)) {
      const filePath = path.join(root, relativePath)
      await mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(filePath, contents, 'utf8')
    }

    await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}
