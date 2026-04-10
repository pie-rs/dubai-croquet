import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const { mockedGetDb } = vi.hoisted(() => ({
  mockedGetDb: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: mockedGetDb,
}))

afterEach(() => {
  vi.clearAllMocks()
})

function createDbMock() {
  const returning = vi.fn().mockResolvedValue([
    {
      id: 'fa4f4a2c-5b31-4b6d-a8a8-7fd4a23b8a65',
      formType: 'newsletter',
      name: null,
      email: 'amelia@example.com',
      createdAt: new Date('2026-04-10T10:00:00.000Z'),
    },
  ])
  const values = vi.fn().mockReturnValue({ returning })
  const insert = vi.fn().mockReturnValue({ values })

  return { insert }
}

describe('newsletter route', () => {
  it('stores a valid newsletter submission', async () => {
    const db = createDbMock()
    mockedGetDb.mockReturnValue({ insert: db.insert } as never)

    const response = await POST(
      new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: ' amelia@example.com ' }),
      }),
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      submission: {
        formType: 'newsletter',
        email: 'amelia@example.com',
      },
    })
  })

  it('rejects invalid newsletter submissions', async () => {
    const response = await POST(
      new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'oops' }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: 'Invalid newsletter submission',
    })
  })
})
