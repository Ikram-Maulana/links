import { addCachedData, getCachedData } from "@/lib/redis";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { count } from "drizzle-orm";

export const metricsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const cachedData = (await getCachedData("metrics")) as {
        value: number;
      }[];

      if (cachedData) {
        return {
          counts: {
            links: cachedData[0]?.value,
          },
        };
      }

      const prepared = ctx.db
        .select({
          value: count(),
        })
        .from(linksList)
        .prepare();

      const totalLinks = await prepared.all();
      await addCachedData("metrics", totalLinks);

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
