import { db } from "@/server/db";
import { linksList } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";
export const preferredRegion = ["sin1"];
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split("/").pop();

  const slugIsNumber = !isNaN(Number(slug));

  if (!slug || slugIsNumber) {
    return Response.json(
      {
        error:
          "[X] Error: Missing slug? Remember that urls start like this: /s/:slug",
      },
      {
        status: 404,
      },
    );
  }

  const data = await db
    .select()
    .from(linksList)
    .where(eq(linksList.slug, slug));

  if (!data || data.length === 0) {
    return Response.json(
      {
        error: "[X] Error: Slug not found",
      },
      {
        status: 404,
      },
    );
  }

  return Response.json(data);
}
