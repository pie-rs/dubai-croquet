import { handleFormSubmission, contactSubmissionSchema } from '@/lib/form-submissions'

export async function POST(request: Request) {
  return handleFormSubmission(request, {
    formType: 'contact',
    schema: contactSubmissionSchema,
    invalidMessage: 'Invalid contact submission',
  })
}
