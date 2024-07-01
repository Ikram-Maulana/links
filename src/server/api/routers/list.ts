import { getListSchema } from "@/app/(authenticated)/dashboard/links-list/_lib/validation";
import { filterColumn } from "@/lib/filter-column";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { list } from "@/server/db/schema";
import { asc, count, desc, eq, sql, type InferSelectModel } from "drizzle-orm";
import slugify from "slugify";
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

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string().url(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const slug = slugify(input.title, { lower: true });

        const existingListPrepared = db
          .select()
          .from(list)
          .where(eq(list.slug, sql.placeholder("slug")))
          .prepare();
        const [existingList] = await existingListPrepared.all({ slug });
        const isSlugExist = !!existingList;

        if (isSlugExist) {
          throw new Error("Change the title, the slug already exists.");
        }

        const listData = {
          title: input.title,
          slug,
          url: input.url,
          isPublished: input.isPublished,
        } as InferSelectModel<typeof list>;

        const createListPrepared = db
          .insert(list)
          .values(listData)
          .returning()
          .prepare();
        const createdList = await createListPrepared.all();

        return createdList;
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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const deleteListPrepared = db
          .delete(list)
          .where(eq(list.id, sql.placeholder("listId")))
          .prepare();
        const deleteList = await deleteListPrepared.all({
          listId: input.id,
        });

        return deleteList;
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
