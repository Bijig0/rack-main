ALTER TABLE "rental_appraisal_data" ADD COLUMN "identifier" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_rental_appraisal_identifier" ON "rental_appraisal_data" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" ADD CONSTRAINT "rental_appraisal_data_identifier_unique" UNIQUE("identifier");