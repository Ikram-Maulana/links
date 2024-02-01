import { db } from "@/server/db";
import { linksList } from "@/server/db/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db.select().from(linksList);

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case "NotFoundError":
          return NextResponse.json(
            { error: "The requested resource could not be found." },
            { status: 404 },
          );
        case "ValidationError":
          return NextResponse.json(
            { error: "The request is invalid." },
            { status: 400 },
          );
        case "GatewayTimeoutError":
          return NextResponse.json(
            { error: "Gateway timeout error." },
            { status: 504 },
          );
        default:
          return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
