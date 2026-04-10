import { describe, expect, it } from 'vitest'
import { createTinaContentLoader } from '@/lib/tina'

const loader = createTinaContentLoader({ baseDir: process.cwd() })

describe('migrated legacy content', () => {
  it('preserves the expected public page slugs', async () => {
    const pages = await loader.getAllPages()
    expect(pages.map((page) => page.slug)).toEqual([
      '',
      'about-us',
      'contact-us',
      'dubai-croquet-2023-clements-cup-season-opener',
      'events',
      'faq',
      'gallery',
      'leader-board',
      'links',
      'news',
      'player-registration',
      'privacy-policy',
      'termsandconditions',
      'the-game',
    ])
  })

  it('preserves migrated blog metadata and local media rewrites', async () => {
    const posts = await loader.getAllPosts()
    expect(posts.map((post) => post.slug)).toEqual([
      'croquet-updates-from-amelia-and-friends',
      'does-boris-johnson-play-croquet',
      'post-three',
      'post-eight',
      'post-four',
    ])

    const borisPost = await loader.getPost('does-boris-johnson-play-croquet')
    expect(borisPost).toMatchObject({
      title: 'Boris Johnson Gets Lifetime Croquet Ban',
      date: '2022-01-15',
      featuredImage: {
        src: '/images/blog/does-boris-johnson-play-croquet/featured.webp',
      },
    })

    const ameliaPost = await loader.getPost('croquet-updates-from-amelia-and-friends')
    expect(String(ameliaPost?.body)).toContain(
      '/images/blog/croquet-updates-from-amelia-and-friends/featured.png',
    )

    expect(String(borisPost?.body)).toContain(
      '/images/blog/does-boris-johnson-play-croquet/guardian.jpg',
    )
    expect(String(borisPost?.body)).not.toContain('https://miro.medium.com')
    expect(String(borisPost?.body)).not.toContain('https://i.guim.co.uk')
  })

  it('preserves the migrated team roster', async () => {
    const team = await loader.getTeam()
    expect(team).toHaveLength(8)
    expect(team.map((person) => person.slug)).toEqual([
      'desmond-eagle',
      'dianne-ameter',
      'hilary-ouse',
      'hugh-saturation',
      'person-b7rybasni',
      'person-n413pmsg5',
      'person-suueq7fv0',
      'person-yn34ntfi7',
    ])
  })
})
