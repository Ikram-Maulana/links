// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  int,
  sqliteTableCreator,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `links_${name}`);

export const list = createTable(
  "list",
  {
    id: text("id").notNull().primaryKey().$defaultFn(uuidv7),
    title: text("title").notNull(),
    url: text("url").notNull(),
    slug: text("slug").notNull(),
    clicked: int("clicked")
      .notNull()
      .$default(() => 0),
    isPublished: int("is_published", { mode: "boolean" })
      .notNull()
      .$default(() => false),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }),
  },
  (list) => ({
    unq: unique().on(list.slug),
    idListIdx: index("id_list_idx").on(list.id),
  }),
);
