import { handleFormSubmission, newsletterSubmissionSchema } from '@/lib/form-submissions'

export async function POST(request: Request) {
  return handleFormSubmission(request, {
    formType: 'newsletter',
    schema: newsletterSubmissionSchema,
    invalidMessage: 'Invalid newsletter submission',
  })
}
