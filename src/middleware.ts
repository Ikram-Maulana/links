import { type linksList } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

type DataLinkProps = InferSelectModel<typeof linksList>;

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop();

  try {
    const data = await fetch(`${req.nextUrl.origin}/api/url/${slug}`);

    if (!data || data.status === 404) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    const dataToJson = (await data.json()) as DataLinkProps;
    const url = dataToJson?.url;

    if (url) {
      try {
        new URL(url);
        return NextResponse.redirect(
          `${url}?utm_source=ikramlinks&utm_medium=redirect&utm_campaign=ikramlinks`,
        );
      } catch (error) {
        console.error("Invalid URL", url);
        return NextResponse.redirect(req.nextUrl.origin);
      }
    }
  } catch (error) {
    console.error("Error fetching", error);
    return NextResponse.redirect(req.nextUrl.origin);
  }
}

export const config = {
  matcher: "/s/:path*",
};
