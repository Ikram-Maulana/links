import { allowedBotList } from "@/data";
import { env } from "@/env";
import {
  apiRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  trpcPublicRoutes,
} from "@/routes";
import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";
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
      allow: allowedBotList,
    }),
  ],
});

const ajrl = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "60s",
      max: 100,
    }),
  ],
});

async function handleBotProtection(req: NextRequest) {
  const decision = await aj.protect(req);

  if (decision.isErrored()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  if (decision.isDenied() && decision.reason.isBot()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

async function handleRateLimiting(req: NextRequest) {
  if (
    req.url.includes("/api/hono") ||
    trpcPublicRoutes.some((route) => req.url.includes(route))
  ) {
    const rateLimit = await ajrl.protect(req);
    if (rateLimit.isErrored()) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 },
      );
    }
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
