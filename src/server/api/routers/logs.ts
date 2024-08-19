import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { links, logs, type selectLogSchema } from "@/server/db/schema";
import { getLogsSchema } from "@/types";
import { asc, count, desc, eq } from "drizzle-orm";
import { type z } from "zod";

type Logs = z.infer<typeof selectLogSchema>;

export const logRouter = createTRPCRouter({
  getAll: protectedProcedure.input(getLogsSchema).query(async ({ input }) => {
    try {
      const { page, per_page, sort } = input;

      // Offset to paginate the results
      const offset = (page - 1) * per_page;
      // Column and order to sort by
      // Spliting the sort string by "." to get the column and order
      // Example: "title.desc" => ["title", "desc"]
      const [column, order] = (sort?.split(".") as [
        keyof Logs | undefined,
        "asc" | "desc" | undefined,
      ]) ?? ["createdAt", "desc"];

      const dataPrepared = db
        .select()
        .from(logs)
        .leftJoin(links, eq(logs.linkId, links.id))
        .limit(per_page)
        .offset(offset)
        .orderBy(
          column && column in logs
            ? order === "desc"
              ? desc(logs[column])
              : asc(logs[column])
            : desc(logs.createdAt),
        )
        .prepare();

      const totalPrepared = db
        .select({
          count: count(),
        })
        .from(logs)
        .prepare();

      const { data, total } = await db.transaction(async () => {
        const data = await dataPrepared.execute();
        const total = await totalPrepared
          .execute()
          .then((res) => res[0]?.count ?? 0);
        return { data, total };
      });

      const pageCount = Math.ceil(total / per_page);
      return { data, pageCount };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error",
      );
    }
  }),
});
