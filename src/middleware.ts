import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiRoutes,
  authRoutes,
  publicRoutes,
} from "./routes";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);
const isAPIRoute = createRouteMatcher(apiRoutes);

export default clerkMiddleware((auth, req) => {
  if (isAPIRoute(req)) return NextResponse.next();

  const { nextUrl } = req;
  const { userId, redirectToSignIn, protect } = auth();
  const isAuth = isAuthRoute(req);
  const isPublic = isPublicRoute(req);

  if (isAuth && userId)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  // The code below manipulates routes that are not public path and not contain the "default login redirect" path to be nexted and will be directed to not found page by Next.js
  if (!req.url.includes(DEFAULT_LOGIN_REDIRECT)) return NextResponse.next();
  if (!userId && !isPublic) return redirectToSignIn();
  if (!isPublic) protect();

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};
