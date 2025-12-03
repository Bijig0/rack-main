import { relations } from "drizzle-orm/relations";
import { pdf, domBindings } from "./schema";

export const domBindingsRelations = relations(domBindings, ({one}) => ({
	pdf: one(pdf, {
		fields: [domBindings.pdfId],
		references: [pdf.id]
	}),
}));

export const pdfRelations = relations(pdf, ({many}) => ({
	domBindings: many(domBindings),
}));