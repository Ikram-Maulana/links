import { env } from "@/env";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiRoutes,
  authRoutes,
  publicRoutes,
  trpcPublicRoutes,
} from "@/routes";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import {
  clerkMiddleware,
  type ClerkMiddlewareAuthObject,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

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
          // Allow generally friendly bots like GoogleBot and DiscordBot. These
          // have a more complex user agent like "AdsBot-Google
          // (+https://www.google.com/adsbot.html)" or "Mozilla/5.0 (compatible;
          // Discordbot/2.0; +https://discordapp.com)" so need multiple patterns
          "^[a-z.0-9/ \\-_]*bot",
          "bot($|[/\\);-]+)",
          "http[s]?://",
          // Vercel screenshot agent
          "vercel-screenshot/1.0",
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

async function handleBotProtection(req: NextRequest) {
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
  return NextResponse.next();
}

async function handleRateLimiting(req: NextRequest) {
  if (
    req.url.includes("/api/hono") ||
    trpcPublicRoutes.some((route) => req.url.includes(route))
  ) {
    const rateLimit = await ajrl.protect(req, { requested: 1 });
    if (rateLimit.isDenied() && rateLimit.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }
  return NextResponse.next();
}

function handleAuthRoutes(
  req: NextRequest,
  auth: () => ClerkMiddlewareAuthObject,
) {
  const { url } = req;
  const { userId, redirectToSignIn, protect } = auth();
  const isAuth = isAuthRoute(req);
  const isPublic = isPublicRoute(req);

  if (isAuth && userId) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));
  }

  if (!req.url.includes(DEFAULT_LOGIN_REDIRECT)) {
    return NextResponse.next();
  }

  if (!userId && !isPublic) {
    return redirectToSignIn();
  }

  if (!isPublic) {
    protect();
  }

  return NextResponse.next();
}

export default clerkMiddleware(async (auth, req) => {
  // Protect from bots and other threats
  const botProtectionResponse = await handleBotProtection(req);
  if (botProtectionResponse.status !== 200) return botProtectionResponse;

  // Rate limit the URL redirect API and the tRPC API that are publicly accessible
  const rateLimitResponse = await handleRateLimiting(req);
  if (rateLimitResponse.status !== 200) return rateLimitResponse;

  if (isAPIRoute(req)) return NextResponse.next();

  return handleAuthRoutes(req, auth);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)", "/s(.*)"],
};
