import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const formSubmissionType = pgEnum('form_submission_type', [
  'contact',
  'newsletter',
  'registration',
])

export const formSubmissions = pgTable(
  'form_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    formType: formSubmissionType('form_type').notNull(),
    name: text('name'),
    email: text('email'),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    formTypeIndex: index('form_submissions_form_type_idx').on(table.formType),
    createdAtIndex: index('form_submissions_created_at_idx').on(table.createdAt),
  }),
)
