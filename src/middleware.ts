import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type InferSelectModel } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiRoutes,
  authRoutes,
  linkRoutes,
  publicRoutes,
} from "./routes";
import { type list } from "./server/db/schema";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);
const isAPIRoute = createRouteMatcher(apiRoutes);
const isLinkRoute = createRouteMatcher(linkRoutes);

type DataLinkProps = InferSelectModel<typeof list>;

export default clerkMiddleware(async (auth, req) => {
  if (isAPIRoute(req)) return NextResponse.next();

  const { nextUrl } = req;
  const { userId, redirectToSignIn, protect } = auth();
  const isAuth = isAuthRoute(req);
  const isPublic = isPublicRoute(req);

  if (isAuth && userId)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  // The code below manipulates routes that are not public path, not contain the "default login redirect path, and not contain the "/s/" path to be nexted and will be directed to not found page by Next.js
  if (!req.url.includes(DEFAULT_LOGIN_REDIRECT) && !req.url.includes("/s/"))
    return NextResponse.next();
  if (!userId && !isPublic) return redirectToSignIn();
  if (!isPublic) protect();

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
