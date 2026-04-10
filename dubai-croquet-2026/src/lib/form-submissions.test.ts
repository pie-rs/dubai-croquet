import { describe, expect, it, vi } from 'vitest'
import { contactSubmissionSchema, registrationSubmissionSchema, saveSubmission } from '@/lib/form-submissions'

const { mockedGetDb } = vi.hoisted(() => ({
  mockedGetDb: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: mockedGetDb,
}))

describe('form submissions helper', () => {
  it('normalizes and validates contact submissions', () => {
    expect(
      contactSubmissionSchema.parse({
        name: '  Amelia  ',
        email: ' amelia@example.com ',
        message: '  Hello there  ',
        updates: 'on',
      }),
    ).toEqual({
      name: 'Amelia',
      email: 'amelia@example.com',
      message: 'Hello there',
      updates: true,
    })
  })

  it('normalizes registration submissions and preserves optional blanks as empty values', () => {
    expect(
      registrationSubmissionSchema.parse({
        name: '  The Captain  ',
        email: '',
        identity: 'Wannabe Captain',
        phoneNumber: '  +971 50 000 0000  ',
        teamName: '  ',
        teamSize: ' 4 ',
        status: '  Single  ',
        clubhouseAttendance: 'false',
        croquetCareer: '',
        updates: false,
      }),
    ).toEqual({
      name: 'The Captain',
      email: undefined,
      identity: 'Wannabe Captain',
      phoneNumber: '+971 50 000 0000',
      teamName: undefined,
      teamSize: '4',
      status: 'Single',
      clubhouseAttendance: false,
      croquetCareer: undefined,
      updates: false,
    })
  })

  it('returns null when the database is unavailable', async () => {
    mockedGetDb.mockReturnValue(null)

    await expect(
      saveSubmission('newsletter', {
        email: 'news@example.com',
      }),
    ).resolves.toBeNull()
  })

  it('stores normalized submissions when the database is available', async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: 'b7f7f0d2-2d8b-4a07-b2fa-1b2d7bf3b5b2',
        formType: 'contact',
        name: 'Amelia',
        email: 'amelia@example.com',
        createdAt: new Date('2026-04-10T10:00:00.000Z'),
      },
    ])
    const values = vi.fn().mockReturnValue({ returning })
    const insert = vi.fn().mockReturnValue({ values })

    mockedGetDb.mockReturnValue({ insert } as never)

    await expect(
      saveSubmission('contact', {
        name: ' Amelia ',
        email: ' amelia@example.com ',
        message: 'Hello there',
        updates: true,
      }),
    ).resolves.toEqual({
      id: 'b7f7f0d2-2d8b-4a07-b2fa-1b2d7bf3b5b2',
      formType: 'contact',
      name: 'Amelia',
      email: 'amelia@example.com',
      createdAt: '2026-04-10T10:00:00.000Z',
    })

    expect(insert).toHaveBeenCalledTimes(1)
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        formType: 'contact',
        name: 'Amelia',
        email: 'amelia@example.com',
        payload: expect.objectContaining({
          message: 'Hello there',
          updates: true,
        }),
      }),
    )
  })
})
