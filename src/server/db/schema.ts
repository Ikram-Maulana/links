// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTableCreator,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `links_${name}`);

export const links = createTable(
  "links",
  {
    id: text("id").notNull().primaryKey().$defaultFn(uuidv7),
    title: varchar("title").notNull(),
    slug: varchar("slug").notNull(),
    url: varchar("url").notNull(),
    isPublished: boolean("is_published")
      .notNull()
      .$default(() => false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (links) => ({
    unq: unique().on(links.slug),
    idLinksIdx: index().on(links.id),
    slugLinksIdx: index().on(links.slug),
  }),
);
export const linksRelations = relations(links, ({ many }) => ({
  logs: many(logs),
}));
export const insertLinkSchema = createInsertSchema(links, {
  title: (schema) =>
    schema.title.min(3, "Title must be at least 3 characters long"),
  slug: (schema) =>
    schema.slug.min(3, "Slug must be at least 3 characters long"),
  url: (schema) => schema.url.url(),
  isPublished: z.boolean(),
});

export const logs = createTable(
  "logs",
  {
    id: text("id").notNull().primaryKey().$defaultFn(uuidv7),
    linkId: text("link_id").notNull(),
    ipAddress: text("ip_address").default(""),
    userAgent: text("user_agent").default(""),
    referer: text("referer").default(""),
    platform: text("platform").default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (logs) => ({
    idLogsIdx: index().on(logs.id),
  }),
);
export const logsRelations = relations(logs, ({ one }) => ({
  link: one(links, {
    fields: [logs.linkId],
    references: [links.id],
  }),
}));
export const insertLogSchema = createInsertSchema(logs, {
  linkId: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referer: z.string().optional(),
  platform: z.string().optional(),
});
