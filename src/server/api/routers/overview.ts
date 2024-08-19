import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { links } from "@/server/db/schema";
import { count, sum } from "drizzle-orm";

export const overviewRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    try {
      const linksListCountPrepared = db
        .select({
          count: count(),
        })
        .from(links)
        .prepare();

      const clickedLinksSumPrepared = db
        .select({
          sum: sum(links.clicked),
        })
        .from(links)
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
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error",
      );
    }
  }),
});
