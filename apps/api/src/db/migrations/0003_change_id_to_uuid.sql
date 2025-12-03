-- Drop the identifier column and its constraints
DROP INDEX IF EXISTS "idx_rental_appraisal_identifier";--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" DROP CONSTRAINT IF EXISTS "rental_appraisal_data_identifier_unique";--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" DROP COLUMN IF EXISTS "identifier";--> statement-breakpoint

-- Change id column from serial to uuid
ALTER TABLE "rental_appraisal_data" DROP CONSTRAINT "rental_appraisal_data_pkey";--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" ALTER COLUMN "id" SET DATA TYPE uuid USING id::text::uuid;--> statement-breakpoint
ALTER TABLE "rental_appraisal_data" ADD PRIMARY KEY ("id");--> statement-breakpoint

-- Add pdf_url column if it doesn't exist
ALTER TABLE "rental_appraisal_data" ADD COLUMN IF NOT EXISTS "pdf_url" text;
