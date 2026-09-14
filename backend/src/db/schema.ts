import { pgEnum, pgTable, uuid, varchar, text, boolean, timestamp, integer, jsonb, uniqueIndex, index, primaryKey } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['owner', 'admin', 'member']);
export const surveyStatusEnum = pgEnum('survey_status', ['draft', 'published', 'closed', 'archived']);
export const questionTypeEnum = pgEnum('question_type', ['single_choice', 'multiple_choice', 'text']);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(), name: varchar('name', { length: 160 }).notNull(), publicName: varchar('public_name', { length: 160 }), contactEmail: varchar('contact_email', { length: 320 }).notNull(), settings: jsonb('settings').$type<Record<string, unknown>>().default({}), timezone: varchar('timezone', { length: 80 }).default('UTC').notNull(), ...timestamps,
});
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), tenantId: uuid('tenant_id').references(() => tenants.id).notNull(), name: varchar('name', { length: 160 }).notNull(), email: varchar('email', { length: 320 }).notNull(), passwordHash: text('password_hash').notNull(), role: roleEnum('role').default('member').notNull(), active: boolean('active').default(true).notNull(), ...timestamps,
}, (t) => ({ tenantEmail: uniqueIndex('users_tenant_email_idx').on(t.tenantId, t.email), tenant: index('users_tenant_idx').on(t.tenantId) }));
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(), tenantId: uuid('tenant_id').references(() => tenants.id).notNull(), userId: uuid('user_id').references(() => users.id).notNull(), tokenHash: text('token_hash').notNull().unique(), expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), revokedAt: timestamp('revoked_at', { withTimezone: true }), replacedById: uuid('replaced_by_id'), ...timestamps,
}, (t) => ({ tokenHashIdx: index('refresh_tokens_hash_idx').on(t.tokenHash), tenant: index('refresh_tokens_tenant_idx').on(t.tenantId) }));

export const surveys = pgTable('surveys', {
  id: uuid('id').defaultRandom().primaryKey(), tenantId: uuid('tenant_id').references(() => tenants.id).notNull(), title: varchar('title', { length: 200 }).notNull(), description: text('description'), status: surveyStatusEnum('status').default('draft').notNull(), publicSlug: varchar('public_slug', { length: 32 }).notNull().unique(), publishedAt: timestamp('published_at', { withTimezone: true }), closedAt: timestamp('closed_at', { withTimezone: true }), startsAt: timestamp('starts_at', { withTimezone: true }), expiresAt: timestamp('expires_at', { withTimezone: true }), maxResponses: integer('max_responses'), ...timestamps,
}, (t) => ({ tenant: index('surveys_tenant_idx').on(t.tenantId), slug: index('surveys_public_slug_idx').on(t.publicSlug) }));
export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(), surveyId: uuid('survey_id').references(() => surveys.id).notNull(), type: questionTypeEnum('type').notNull(), title: varchar('title', { length: 500 }).notNull(), description: text('description'), required: boolean('required').default(false).notNull(), position: integer('position').notNull(), ...timestamps,
}, (t) => ({ survey: index('questions_survey_idx').on(t.surveyId) }));
export const questionOptions = pgTable('question_options', {
  id: uuid('id').defaultRandom().primaryKey(), questionId: uuid('question_id').references(() => questions.id).notNull(), label: varchar('label', { length: 300 }).notNull(), value: varchar('value', { length: 300 }).notNull(), position: integer('position').notNull(), ...timestamps,
});
export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(), surveyId: uuid('survey_id').references(() => surveys.id).notNull(), submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(), createdAt: timestamps.createdAt,
}, (t) => ({ survey: index('responses_survey_idx').on(t.surveyId) }));
export const surveyAnswers = pgTable('survey_answers', {
  id: uuid('id').defaultRandom().primaryKey(), responseId: uuid('response_id').references(() => surveyResponses.id).notNull(), questionId: uuid('question_id').references(() => questions.id).notNull(), textValue: text('text_value'), selectedOptionIds: uuid('selected_option_ids').array(), createdAt: timestamps.createdAt,
});
export const anonymousResponseLimits = pgTable('anonymous_response_limits', {
  surveyId: uuid('survey_id').references(() => surveys.id).notNull(), fingerprint: varchar('fingerprint', { length: 64 }).notNull(), expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), createdAt: timestamps.createdAt,
}, (t) => ({ pk: primaryKey({ columns: [t.surveyId, t.fingerprint] }), expiry: index('anonymous_limits_expiry_idx').on(t.expiresAt) }));
