import { env } from "@/env";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiRoutes,
  authRoutes,
  publicRoutes,
  trpcPublicRoutes,
} from "@/routes";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);
const isAPIRoute = createRouteMatcher(apiRoutes);

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      block: ["AUTOMATED"],
      patterns: {
        remove: [
          // Vercel screenshot agent
          "vercel-screenshot/1.0",
          // Allow generally friendly bots like GoogleBot and DiscordBot. These
          // have a more complex user agent like "AdsBot-Google
          // (+https://www.google.com/adsbot.html)" or "Mozilla/5.0 (compatible;
          // Discordbot/2.0; +https://discordapp.com)" so need multiple patterns
          "^[a-z.0-9/ \\-_]*bot",
          "bot($|[/\\);-]+)",
          "http[s]?://",
          // Chrome Lighthouse
          "Chrome-Lighthouse",
        ],
      },
    }),
  ],
});

const ajrl = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 100,
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
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
    req.url.includes("/api/hono") ||
    trpcPublicRoutes.some((route) => req.url.includes(route))
  ) {
    const rateLimit = await ajrl.protect(req, { requested: 1 });

    if (rateLimit.isDenied() && rateLimit.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    return NextResponse.next();
  }

  if (isAPIRoute(req)) return NextResponse.next();

  const { url } = req;
  const { userId, redirectToSignIn, protect } = auth();
  const isAuth = isAuthRoute(req);
  const isPublic = isPublicRoute(req);

  if (isAuth && userId)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));

  // The code below manipulates routes that are not public path, not contain the "default login redirect path, and not contain the "/s/" path to be nexted and will be directed to not found page by Next.js
  if (!req.url.includes(DEFAULT_LOGIN_REDIRECT)) return NextResponse.next();
  if (!userId && !isPublic) return redirectToSignIn();
  if (!isPublic) protect();

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)", "/s(.*)"],
};
