import { shortRouter } from "@/server/hono/routers/short";
import { Hono } from "hono";

const h = new Hono();

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = h.route("/short", shortRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
