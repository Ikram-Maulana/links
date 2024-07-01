import { getListSchema } from "@/app/(authenticated)/dashboard/links-list/_lib/validation";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { asc, count, desc, eq, sql, type InferSelectModel } from "drizzle-orm";
import { list } from "@/server/db/schema";
import { filterColumn } from "@/lib/filter-column";
import * as z from "zod";

type List = InferSelectModel<typeof list>;

export const listRouter = createTRPCRouter({
  getAll: protectedProcedure.input(getListSchema).query(async ({ input }) => {
    try {
      const { page, per_page, sort, title } = input;

      // Offset to paginate the results
      const offset = (page - 1) * per_page;
      // Column and order to sort by
      // Spliting the sort string by "." to get the column and order
      // Example: "title.desc" => ["title", "desc"]
      const [column, order] = (sort?.split(".") as [
        keyof List | undefined,
        "asc" | "desc" | undefined,
      ]) ?? ["title", "desc"];

      const dataPrepared = db
        .select()
        .from(list)
        .limit(per_page)
        .offset(offset)
        .where(
          // Filter list by title
          title
            ? filterColumn({
                column: list.title,
                value: title,
              })
            : undefined,
        )
        .orderBy(
          column && column in list
            ? order === "asc"
              ? asc(list[column])
              : desc(list[column])
            : desc(list.createdAt),
        )
        .prepare();

      const totalPrepared = db
        .select({
          count: count(),
        })
        .from(list)
        .where(
          // Filter list by title
          title
            ? filterColumn({
                column: list.title,
                value: title,
              })
            : undefined,
        )
        .prepare();

      const { data, total } = await db.transaction(async () => {
        const data = await dataPrepared.all();
        const total = await totalPrepared
          .execute()
          .then((res) => res[0]?.count ?? 0);

        return {
          data,
          total,
        };
      });

      const pageCount = Math.ceil(total / per_page);
      return { data, pageCount };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      return {
        error: "Internal Server Error",
      };
    }
  }),

  setIsPublished: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const setIsPublishedPrepared = db
          .update(list)
          .set({
            isPublished: input.isPublished,
          })
          .where(eq(list.id, sql.placeholder("listId")))
          .returning()
          .prepare();
        const setIsPublished = await setIsPublishedPrepared.all({
          listId: input.id,
        });

        return setIsPublished;
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
