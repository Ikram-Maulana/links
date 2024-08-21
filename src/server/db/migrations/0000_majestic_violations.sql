CREATE TABLE `links_links` (
	`id` varchar(256) NOT NULL,
	`title` text NOT NULL,
	`slug` varchar(256) NOT NULL,
	`url` text NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `links_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `links_links_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `links_logs` (
	`id` varchar(256) NOT NULL,
	`link_id` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`referer` text,
	`platform` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `links_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `id_idx` ON `links_links` (`id`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `links_links` (`slug`);--> statement-breakpoint
CREATE INDEX `id_idx` ON `links_logs` (`id`);