import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formSubmissions } from '@/db/schema'
import { getDb } from '@/db'

const submissionTypes = ['contact', 'newsletter', 'registration'] as const

export const submissionTypeSchema = z.enum(submissionTypes)

const requiredText = z.string().trim().min(1, 'Required')
const optionalText = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  },
  z.string().trim().min(1).optional(),
)
const requiredEmail = z.string().trim().email('Enter a valid email address')
const optionalEmail = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  },
  z.string().trim().email('Enter a valid email address').optional(),
)
const checkbox = z.preprocess(
  (value) => {
    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'number') {
      return value !== 0
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase()
      if (['true', 'on', '1', 'yes'].includes(normalized)) return true
      if (['false', 'off', '0', 'no', ''].includes(normalized)) return false
    }

    return value
  },
  z.boolean().default(false),
)

export const contactSubmissionSchema = z.object({
  name: requiredText,
  email: requiredEmail,
  message: requiredText,
  updates: checkbox,
})

export const newsletterSubmissionSchema = z.object({
  email: requiredEmail,
})

export const registrationSubmissionSchema = z.object({
  name: requiredText,
  email: optionalEmail,
  identity: requiredText,
  phoneNumber: requiredText,
  teamName: optionalText,
  teamSize: optionalText,
  status: optionalText,
  clubhouseAttendance: checkbox,
  croquetCareer: optionalText,
  updates: checkbox,
})

export type SubmissionType = z.infer<typeof submissionTypeSchema>

export type StoredFormSubmission = {
  id: string
  formType: SubmissionType
  name: string | null
  email: string | null
  createdAt: string
}

function isFormDataRequest(request: Request) {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  return (
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')
  )
}

function formDataToObject(formData: FormData) {
  const payload: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    payload[key] = value instanceof File ? value.name : value
  }

  return payload
}

export async function readSubmissionPayload(request: Request) {
  if (isFormDataRequest(request)) {
    return formDataToObject(await request.formData())
  }

  return request.json()
}

function pickTextValue(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

export async function saveSubmission(
  formType: SubmissionType,
  payload: Record<string, unknown>,
): Promise<StoredFormSubmission | null> {
  const db = getDb()
  if (!db) {
    return null
  }

  const [record] = await db
    .insert(formSubmissions)
    .values({
      formType,
      name: pickTextValue(payload, 'name'),
      email: pickTextValue(payload, 'email'),
      payload,
    })
    .returning({
      id: formSubmissions.id,
      formType: formSubmissions.formType,
      name: formSubmissions.name,
      email: formSubmissions.email,
      createdAt: formSubmissions.createdAt,
    })

  if (!record) {
    return null
  }

  return {
    id: record.id,
    formType: record.formType,
    name: record.name,
    email: record.email,
    createdAt: record.createdAt.toISOString(),
  }
}

export async function handleFormSubmission(
  request: Request,
  options: {
    formType: SubmissionType
    schema:
      | typeof contactSubmissionSchema
      | typeof newsletterSubmissionSchema
      | typeof registrationSubmissionSchema
    invalidMessage: string
  },
) {
  let body: unknown

  try {
    body = await readSubmissionPayload(request)
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body' },
      { status: 400 },
    )
  }

  const parsed = options.schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: options.invalidMessage,
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  try {
    const submission = await saveSubmission(options.formType, parsed.data)
    if (!submission) {
      return NextResponse.json(
        { ok: false, error: 'Form storage is unavailable' },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        submission,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(`Failed to store ${options.formType} submission`, error)
    return NextResponse.json(
      { ok: false, error: 'Unable to save submission' },
      { status: 500 },
    )
  }
}
