// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
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
    clicked: integer("clicked")
      .notNull()
      .$default(() => 0),
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
export const insertLinkSchema = createInsertSchema(links, {
  title: (schema) =>
    schema.title.min(3, "Title must be at least 3 characters long"),
  slug: (schema) =>
    schema.slug.min(3, "Slug must be at least 3 characters long"),
  url: (schema) => schema.url.url(),
  clicked: (schema) => schema.clicked.int().positive(),
  isPublished: z.boolean(),
});
