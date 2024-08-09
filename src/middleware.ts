import { env } from "@/env";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type InferSelectModel } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiRoutes,
  authRoutes,
  linkRoutes,
  publicRoutes,
  trpcPublicRoutes,
} from "./routes";
import { type list } from "./server/db/schema";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);
const isAPIRoute = createRouteMatcher(apiRoutes);
const isLinkRoute = createRouteMatcher(linkRoutes);
const whitelistASN = ["15169"];

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      block: ["AUTOMATED", "LIKELY_AUTOMATED"],
    }),
  ],
});

const ajrl = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 100,
    }),
  ],
});

type DataLinkProps = InferSelectModel<typeof list>;

export default clerkMiddleware(async (auth, req) => {
  // Allow whitelisted ASN
  const asn = req.headers.get("x-vercel-ip-as-number") ?? "";
  if (whitelistASN.includes(asn)) {
    return NextResponse.next();
  }

  // Protect from bots and other threats
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    const { reason } = decision;

    if (reason.isBot()) {
      const { botType } = reason;

      if (botType === "VERIFIED_BOT" || botType === "LIKELY_NOT_A_BOT") {
        return NextResponse.next();
      }
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit the URL redirect API and the tRPC API that publicly accessible
  if (
    req.url.includes("/api/url/") ||
    trpcPublicRoutes.some((route) => req.url.includes(route))
  ) {
    const rateLimit = await ajrl.protect(req, { requested: 1 });

    if (rateLimit.isDenied() && rateLimit.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    return NextResponse.next();
  }

  if (isAPIRoute(req)) return NextResponse.next();

  const { nextUrl } = req;
  const { userId, redirectToSignIn, protect } = auth();
  const isAuth = isAuthRoute(req);
  const isPublic = isPublicRoute(req);

  if (isAuth && userId)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

  if (isLinkRoute(req)) {
    const slug = req.url.split("/").pop();

    try {
      const response = await fetch(`${req.nextUrl.origin}/api/url/${slug}`);
      if (!response.ok) {
        throw new Error(`Error fetching: ${response.statusText}`);
      }

      const [data] = (await response.json()) as DataLinkProps[];
      if (!data || !isValidUrl(data.url)) {
        throw new Error("URL is invalid or not found in response");
      }

      return NextResponse.redirect(
        `${data.url}?utm_source=ikramlinks&utm_medium=redirect&utm_campaign=ikramlinks`,
      );
    } catch (error) {
      console.error("Error fetching", error);
      return NextResponse.next();
    }
  }

  // The code below manipulates routes that are not public path, not contain the "default login redirect path, and not contain the "/s/" path to be nexted and will be directed to not found page by Next.js
  if (!req.url.includes(DEFAULT_LOGIN_REDIRECT)) return NextResponse.next();
  if (!userId && !isPublic) return redirectToSignIn();
  if (!isPublic) protect();

  return NextResponse.next();
});

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)", "/s(.*)"],
};
