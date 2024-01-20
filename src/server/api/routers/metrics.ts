import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { count } from "drizzle-orm";

export const metricsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const totalLinks = await ctx.db
        .select({
          value: count(),
        })
        .from(linksList);

      return {
        counts: {
          links: totalLinks[0]?.value,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      return {
        error: "Server Error",
      };
    }
  }),
});
