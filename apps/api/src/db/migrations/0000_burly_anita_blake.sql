CREATE TABLE "dom_bindings" (
	"id" serial PRIMARY KEY NOT NULL,
	"pdf_id" integer NOT NULL,
	"path" text NOT NULL,
	"state_binding" text NOT NULL,
	"properties" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pdf" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pdf_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "dom_bindings" ADD CONSTRAINT "dom_bindings_pdf_id_pdf_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdf"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_dom_bindings_pdf_id" ON "dom_bindings" USING btree ("pdf_id");--> statement-breakpoint
CREATE INDEX "idx_dom_bindings_state" ON "dom_bindings" USING btree ("state_binding");