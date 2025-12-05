import { pgTable, serial, text, timestamp, integer, jsonb, index, uuid, numeric, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * BetterAuth Tables
 */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * BetterAuth Relations
 */
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

/**
 * PDF table - contains single row for 'rental appraisal'
 */
export const pdf = pgTable('pdf', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * DOM Bindings table - maps DOM elements to data bindings
 */
export const domBindings = pgTable('dom_bindings', {
  id: serial('id').primaryKey(),
  pdfId: integer('pdf_id').notNull().references(() => pdf.id, { onDelete: 'cascade' }),
  path: text('path').notNull(), // CSS selector path to DOM element
  stateBinding: text('state_binding').notNull(), // Data path like "reportData.addressCommonName"
  properties: jsonb('properties').notNull().default('{}'), // Extra metadata (dataType, conditionalStyles, etc.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pdfIdIdx: index('idx_dom_bindings_pdf_id').on(table.pdfId),
  stateBindingIdx: index('idx_dom_bindings_state').on(table.stateBinding),
}));

/**
 * Relations
 */
export const pdfRelations = relations(pdf, ({ many }) => ({
  domBindings: many(domBindings),
}));

export const domBindingsRelations = relations(domBindings, ({ one }) => ({
  pdf: one(pdf, {
    fields: [domBindings.pdfId],
    references: [pdf.id],
  }),
}));

/**
 * Property table - core property information for list views and filtering
 */
export const property = pgTable('property', {
  id: uuid('id').primaryKey().notNull(),
  // Address info
  addressCommonName: text('address_common_name').notNull(),
  // Basic property info
  bedroomCount: integer('bedroom_count'),
  bathroomCount: integer('bathroom_count'),
  propertyType: text('property_type'),
  landAreaSqm: numeric('land_area_sqm'),
  // Thumbnail for list view
  propertyImageUrl: text('property_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  addressIdx: index('idx_property_address').on(table.addressCommonName),
}));

/**
 * Appraisal table - stores full report data as JSONB
 * Linked to property table for core fields
 */
export const appraisal = pgTable('appraisal', {
  id: uuid('id').primaryKey().notNull(),
  propertyId: uuid('property_id').notNull().references(() => property.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  status: text('status').notNull().default('pending'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  propertyIdIdx: index('idx_appraisal_property_id').on(table.propertyId),
}));

/**
 * Property <-> Appraisal Relations
 */
export const propertyRelations = relations(property, ({ many }) => ({
  appraisals: many(appraisal),
}));

export const appraisalRelations = relations(appraisal, ({ one }) => ({
  property: one(property, {
    fields: [appraisal.propertyId],
    references: [property.id],
  }),
}));

/**
 * TypeScript types inferred from schema
 */
export type Pdf = typeof pdf.$inferSelect;
export type NewPdf = typeof pdf.$inferInsert;
export type DomBinding = typeof domBindings.$inferSelect;
export type NewDomBinding = typeof domBindings.$inferInsert;
export type Property = typeof property.$inferSelect;
export type NewProperty = typeof property.$inferInsert;
export type Appraisal = typeof appraisal.$inferSelect;
export type NewAppraisal = typeof appraisal.$inferInsert;
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

// Legacy alias for backward compatibility during migration
export const rentalAppraisalData = appraisal;
export type RentalAppraisalData = Appraisal;
export type NewRentalAppraisalData = NewAppraisal;
