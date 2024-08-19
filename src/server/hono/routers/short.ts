import { db } from "@/server/db";
import { links, logs } from "@/server/db/schema";
import { createLogSchema } from "@/types";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

const h = new Hono();

export const shortRouter = h.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const slugIsNumber = !isNaN(Number(slug));

  if (!slug || slugIsNumber) {
    return c.notFound();
  }

  const prepared = db
    .select()
    .from(links)
    .where(eq(links.slug, sql.placeholder("linkSlug")))
    .prepare("getLinkBySlug");

  const data = await prepared.execute({ linkSlug: slug });

  if (!data || !Boolean(data.length)) {
    return c.notFound();
  }

  const ipAddress = Array.isArray(c.req.header("x-forwarded-for"))
    ? c.req.header("x-forwarded-for")?.[0]
    : c.req.header("x-forwarded-for");

  if (ipAddress === "::1") {
    return c.redirect(data[0]?.url ?? "");
  }

  const platform = Array.isArray(c.req.header("sec-ch-ua-platform"))
    ? c.req.header("sec-ch-ua-platform")?.[0]
    : c.req.header("sec-ch-ua-platform");
  const userAgent = c.req.header("user-agent");
  const referer = c.req.header("referer");

  const logData = {
    linkId: data[0]?.id,
    ipAddress,
    platform,
    userAgent,
    referer,
  };

  try {
    const logDataValidated = createLogSchema.parse(logData);

    const insertLogPrepared = db
      .insert(logs)
      .values(logDataValidated)
      .returning()
      .prepare("createLog");
    await insertLogPrepared.execute();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return c.notFound();
  }

  return c.redirect(data[0]?.url ?? "");
});
