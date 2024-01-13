import { metricsRouter } from "@/server/api/routers/metrics";
import { publicMetadataRouter } from "@/server/api/routers/public-metadata";
import { settingsRouter } from "@/server/api/routers/settings";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
  publicMetadata: publicMetadataRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
