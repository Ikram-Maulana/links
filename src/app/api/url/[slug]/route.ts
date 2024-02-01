import { addCachedData, getCachedData } from "@/lib/redis";
import { db } from "@/server/db";
import { linksList } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split("/").pop();

  const slugIsNumber = !isNaN(Number(slug));

  if (!slug || slugIsNumber) {
    return NextResponse.json(
      {
        error:
          "[X] Error: Missing slug? Remember that urls start like this: /s/:slug",
      },
      {
        status: 404,
      },
    );
  }

  const cachedData = await getCachedData(`slug:${slug}`);

  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const data = await db
    .select()
    .from(linksList)
    .where(eq(linksList.slug, slug));

  if (!data || data.length === 0) {
    return NextResponse.json(
      {
        error: "[X] Error: Slug not found",
      },
      {
        status: 404,
      },
    );
  }

  await addCachedData(`slug:${slug}`, data);

  return NextResponse.json(data);
}
