CREATE TYPE "public"."form_submission_type" AS ENUM('contact', 'newsletter', 'registration');--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_type" "form_submission_type" NOT NULL,
	"name" text,
	"email" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "form_submissions_form_type_idx" ON "form_submissions" USING btree ("form_type");--> statement-breakpoint
CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");