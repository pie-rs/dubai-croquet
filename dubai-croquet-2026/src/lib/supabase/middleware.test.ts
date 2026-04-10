import { NextRequest } from 'next/server'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { updateSession } from '@/lib/supabase/middleware'

const { mockedCreateServerClient } = vi.hoisted(() => ({
  mockedCreateServerClient: vi.fn(),
}))

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockedCreateServerClient,
}))

describe('updateSession', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const originalAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnonKey
  })

  it('returns a pass-through response when supabase env vars are missing', async () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = await updateSession(request)

    expect(response.status).toBe(200)
    expect(mockedCreateServerClient).not.toHaveBeenCalled()
  })

  it('creates a server client and refreshes the auth session when env vars exist', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    const getUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null })
    mockedCreateServerClient.mockReturnValue({
      auth: {
        getUser,
      },
    })

    const request = new NextRequest('http://localhost:3000/dashboard')
    await updateSession(request)

    expect(mockedCreateServerClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    )
    expect(getUser).toHaveBeenCalledTimes(1)
  })
})
