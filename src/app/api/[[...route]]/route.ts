import { db } from "@/server/db";
import { list } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/url/:slug", async (c) => {
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
    .from(list)
    .where(eq(list.slug, sql.placeholder("linkSlug")))
    .prepare();

  const data = await prepared.all({ linkSlug: slug });

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

  return c.json(data);
});

export const GET = handle(app);
