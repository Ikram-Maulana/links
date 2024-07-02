CREATE TABLE `links_list` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`slug` text NOT NULL,
	`clicked` integer NOT NULL,
	`is_published` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `id_list_idx` ON `links_list` (`id`);--> statement-breakpoint
CREATE INDEX `slug_list_idx` ON `links_list` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `links_list_slug_unique` ON `links_list` (`slug`);