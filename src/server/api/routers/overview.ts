import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { list } from "@/server/db/schema";
import { count, sum } from "drizzle-orm";

export const overviewRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    try {
      const linksListCountPrepared = db
        .select({
          count: count(),
        })
        .from(list)
        .prepare();

      const clickedLinksSumPrepared = db
        .select({
          sum: sum(list.clicked),
        })
        .from(list)
        .prepare();

      const { linksListCount, clickedLinksSum } = await db.transaction(
        async () => {
          const linksListCount = await linksListCountPrepared
            .execute()
            .then((res) => res[0]?.count ?? 0);
          const clickedLinksSum = await clickedLinksSumPrepared
            .execute()
            .then((res) => res[0]?.sum ?? 0);

          return {
            linksListCount,
            clickedLinksSum,
          };
        },
      );

      return {
        linksListCount,
        clickedLinksSum,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      return {
        error: "Internal Server Error",
      };
    }
  }),
});
