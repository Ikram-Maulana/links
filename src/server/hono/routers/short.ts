import { db } from "@/server/db";
import { links } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

const h = new Hono();

export const shortRouter = h.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const slugIsNumber = !isNaN(Number(slug));

  if (!slug || slugIsNumber) {
    return c.json(
      {
        message:
          "[X] Error: Missing slug? Remember that urls start like this: /s/:slug",
      },
      {
        status: 400,
      },
    );
  }

  const prepared = db
    .select()
    .from(links)
    .where(eq(links.slug, sql.placeholder("linkSlug")))
    .prepare("getLinkBySlug");

  const data = await prepared.execute({ linkSlug: slug });

  if (!data || data.length === 0) {
    return c.json(
      {
        message: `[X] Error: No data found for slug: ${slug}`,
      },
      {
        status: 404,
      },
    );
  }

  const clickIncrement = db
    .update(links)
    .set({
      clicked: sql`${links.clicked} + 1`,
    })
    .where(eq(links.slug, sql.placeholder("linkSlug")))
    .prepare("ClickIncrement");

  await clickIncrement.execute({ linkSlug: slug });

  return c.json(data);
});
