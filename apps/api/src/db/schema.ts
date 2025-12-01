import { pgTable, serial, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
 * Rental Appraisal Data table - stores report data as JSONB
 */
export const rentalAppraisalData = pgTable('rental_appraisal_data', {
  id: serial('id').primaryKey(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * TypeScript types inferred from schema
 */
export type Pdf = typeof pdf.$inferSelect;
export type NewPdf = typeof pdf.$inferInsert;
export type DomBinding = typeof domBindings.$inferSelect;
export type NewDomBinding = typeof domBindings.$inferInsert;
export type RentalAppraisalData = typeof rentalAppraisalData.$inferSelect;
export type NewRentalAppraisalData = typeof rentalAppraisalData.$inferInsert;
