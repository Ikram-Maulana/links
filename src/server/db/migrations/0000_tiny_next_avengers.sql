CREATE TABLE IF NOT EXISTS "links_links" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"url" varchar NOT NULL,
	"clicked" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "links_links_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_links_id_index" ON "links_links" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_links_slug_index" ON "links_links" USING btree ("slug");