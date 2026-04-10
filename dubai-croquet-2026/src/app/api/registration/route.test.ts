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
      id: 'fc60a5c7-8796-44b7-9dbf-1d51b8e4cd4f',
      formType: 'registration',
      name: 'The Captain',
      email: 'captain@example.com',
      createdAt: new Date('2026-04-10T10:00:00.000Z'),
    },
  ])
  const values = vi.fn().mockReturnValue({ returning })
  const insert = vi.fn().mockReturnValue({ values })

  return { insert }
}

describe('registration route', () => {
  it('stores a valid registration submission', async () => {
    const db = createDbMock()
    mockedGetDb.mockReturnValue({ insert: db.insert } as never)

    const response = await POST(
      new Request('http://localhost/api/registration', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: ' The Captain ',
          email: ' captain@example.com ',
          identity: 'Wannabe Captain',
          phoneNumber: ' +971xx ',
          teamName: ' The Winners ',
          teamSize: ' 4 ',
          status: ' Dubai Single ',
          clubhouseAttendance: true,
          croquetCareer: ' Born fabulous. ',
          updates: false,
        }),
      }),
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      submission: {
        formType: 'registration',
        name: 'The Captain',
        email: 'captain@example.com',
      },
    })
  })

  it('rejects invalid registration submissions', async () => {
    const response = await POST(
      new Request('http://localhost/api/registration', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: '',
          identity: '',
          phoneNumber: '',
        }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: 'Invalid registration submission',
    })
  })
})
