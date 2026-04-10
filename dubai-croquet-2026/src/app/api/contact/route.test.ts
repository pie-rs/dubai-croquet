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
      formType: 'contact',
      name: 'Amelia',
      email: 'amelia@example.com',
      createdAt: new Date('2026-04-10T10:00:00.000Z'),
    },
  ])
  const values = vi.fn().mockReturnValue({ returning })
  const insert = vi.fn().mockReturnValue({ values })

  return { insert, values, returning }
}

describe('contact route', () => {
  it('stores a valid contact submission', async () => {
    const db = createDbMock()
    mockedGetDb.mockReturnValue({ insert: db.insert } as never)

    const formData = new FormData()
    formData.set('name', ' Amelia ')
    formData.set('email', ' amelia@example.com ')
    formData.set('message', ' Hello there ')
    formData.set('updates', 'on')

    const response = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        body: formData,
      }),
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      submission: {
        formType: 'contact',
        name: 'Amelia',
        email: 'amelia@example.com',
      },
    })
    expect(db.insert).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid contact submissions', async () => {
    const response = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: 'Invalid contact submission',
    })
  })

  it('returns 503 when database storage is unavailable', async () => {
    mockedGetDb.mockReturnValue(null)

    const response = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: 'Amelia',
          email: 'amelia@example.com',
          message: 'Hello there',
          updates: false,
        }),
      }),
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: 'Form storage is unavailable',
    })
  })
})
