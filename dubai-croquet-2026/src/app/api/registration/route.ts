import { handleFormSubmission, registrationSubmissionSchema } from '@/lib/form-submissions'

export async function POST(request: Request) {
  return handleFormSubmission(request, {
    formType: 'registration',
    schema: registrationSubmissionSchema,
    invalidMessage: 'Invalid registration submission',
  })
}
