import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export const linksListRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select()
        .from(linksList)
        .orderBy(desc(linksList.createdAt));

      return data;
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
