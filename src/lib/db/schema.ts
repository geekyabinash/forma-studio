import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// ---- Enums ----

export const departmentEnum = pgEnum('department', [
  'architecture',
  'interior-design',
  'engineering',
  'management',
])

export const employmentTypeEnum = pgEnum('employment_type', [
  'full-time',
  'part-time',
  'internship',
])

export const galleryCategoryEnum = pgEnum('gallery_category', [
  'architecture',
  'interiors',
  'details',
  'process',
])

export const submissionTypeEnum = pgEnum('submission_type', [
  'contact',
  'career',
])

export const submissionStatusEnum = pgEnum('submission_status', [
  'unread',
  'read',
  'archived',
])

export const projectCategoryEnum = pgEnum('project_category', [
  'residential',
  'commercial',
  'interior',
  'landscape',
  'renovation',
])

export const projectStatusEnum = pgEnum('project_status', [
  'completed',
  'in-progress',
  'concept',
])

// ---- Users Table (for NextAuth Credentials) ----

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  mfaEnabled: boolean('mfa_enabled').default(false),
  mfaMethod: text('mfa_method'), // 'email' | 'totp'
  totpSecret: text('totp_secret'), // AES-256-GCM encrypted
  mfaVerifiedAt: timestamp('mfa_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// ---- Password Reset Tokens Table ----

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    used: boolean('used').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_password_reset_tokens_user_id').on(table.userId)]
)

// ---- MFA Backup Codes Table ----

export const mfaBackupCodes = pgTable(
  'mfa_backup_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull(),
    used: boolean('used').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_mfa_backup_codes_user_id').on(table.userId)]
)

// ---- Services Table ----

export const services = pgTable(
  'services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    shortTitle: text('short_title'),
    description: text('description').notNull(),
    icon: text('icon'),
    features: jsonb('features').$type<string[]>().default([]),
    imageUrl: text('image_url'),
    imageAlt: text('image_alt'),
    imageWidth: integer('image_width'),
    imageHeight: integer('image_height'),
    featuredProjectSlug: text('featured_project_slug'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_services_slug').on(table.slug),
    index('idx_services_sort_order').on(table.sortOrder),
  ]
)

// ---- Career Positions Table ----

export const careerPositions = pgTable(
  'career_positions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    department: departmentEnum('department').notNull(),
    employmentType: employmentTypeEnum('employment_type').notNull(),
    location: text('location').notNull(),
    experience: text('experience'),
    description: text('description').notNull(),
    responsibilities: jsonb('responsibilities').$type<string[]>().default([]),
    qualifications: jsonb('qualifications').$type<string[]>().default([]),
    postedDate: date('posted_date').defaultNow(),
    isActive: boolean('is_active').default(true),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_career_positions_department').on(table.department),
    index('idx_career_positions_is_active').on(table.isActive),
    index('idx_career_positions_sort_order').on(table.sortOrder),
  ]
)

// ---- Career Benefits Table ----

export const careerBenefits = pgTable(
  'career_benefits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    icon: text('icon').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('idx_career_benefits_sort_order').on(table.sortOrder)]
)

// ---- Career Values Table ----

export const careerValues = pgTable(
  'career_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('idx_career_values_sort_order').on(table.sortOrder)]
)

// ---- Gallery Items Table ----

export const galleryItems = pgTable(
  'gallery_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectSlug: text('project_slug'),
    imageUrl: text('image_url').notNull(),
    imageAlt: text('image_alt'),
    imageWidth: integer('image_width'),
    imageHeight: integer('image_height'),
    caption: text('caption'),
    category: galleryCategoryEnum('category'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_gallery_items_category').on(table.category),
    index('idx_gallery_items_project_slug').on(table.projectSlug),
    index('idx_gallery_items_sort_order').on(table.sortOrder),
  ]
)

// ---- Form Submissions Table ----

export const formSubmissions = pgTable(
  'form_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: submissionTypeEnum('type').notNull(),
    data: jsonb('data').notNull(),
    status: submissionStatusEnum('status').default('unread'),
    notes: text('notes'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
    readAt: timestamp('read_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_form_submissions_type').on(table.type),
    index('idx_form_submissions_status').on(table.status),
    index('idx_form_submissions_submitted_at').on(table.submittedAt),
  ]
)

// ---- Projects Table ----

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    category: projectCategoryEnum('category').notNull(),
    status: projectStatusEnum('status').notNull(),
    year: integer('year').notNull(),
    location: text('location').notNull(),
    area: text('area'),
    client: text('client'),
    description: text('description').notNull(),
    shortDescription: text('short_description').notNull(),
    heroImage: jsonb('hero_image').$type<{ url: string; alt: string; width: number; height: number }>(),
    gallery: jsonb('gallery').$type<{ url: string; alt: string; width: number; height: number }[]>().default([]),
    featured: boolean('featured').default(false),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_projects_slug').on(table.slug),
    index('idx_projects_category').on(table.category),
    index('idx_projects_status').on(table.status),
    index('idx_projects_featured').on(table.featured),
    index('idx_projects_sort_order').on(table.sortOrder),
  ]
)

// ---- About Content Table (single-row) ----

export const aboutContent = pgTable('about_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroTagline: text('hero_tagline'),
  heroSubtitle: text('hero_subtitle'),
  storyTitle: text('story_title'),
  storyParagraphs: jsonb('story_paragraphs').$type<string[]>().default([]),
  pullQuote: text('pull_quote'),
  pullQuoteAttribution: text('pull_quote_attribution'),
  milestones: jsonb('milestones').$type<{ year: string; title: string; description: string }[]>().default([]),
  teamMembers: jsonb('team_members')
    .$type<{ name: string; role: string; bio: string; sort_order: number; image: { url: string; alt: string; width: number; height: number } }[]>()
    .default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// ---- Contact Info Table (single-row) ----

export const contactInfo = pgTable('contact_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  workingHours: text('working_hours'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// ---- Navigation Settings Table (single-row) ----

export const navigationSettings = pgTable('navigation_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  visibility: jsonb('visibility')
    .$type<Record<string, boolean>>()
    .default({
      '/projects': true,
      '/services': true,
      '/gallery': true,
      '/about': true,
      '/careers': true,
      '/contact': true,
    }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})
