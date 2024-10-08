import { filterColumn } from "@/lib/filter-column";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  insertLinkSchema,
  links,
  logs,
  type selectLinkSchema,
} from "@/server/db/schema";
import {
  createLinkSchema,
  getLinksSchema,
  updateLinkSchema,
  type LinkWithClicked,
} from "@/types";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";

type Links = z.infer<typeof selectLinkSchema>;

export const linkRouter = createTRPCRouter({
  getAll: protectedProcedure.input(getLinksSchema).query(async ({ input }) => {
    try {
      const { page, per_page, sort, title } = input;

      // Offset to paginate the results
      const offset = (page - 1) * per_page;
      // Column and order to sort by
      // Spliting the sort string by "." to get the column and order
      // Example: "title.desc" => ["title", "desc"]
      const [column, order] = (sort?.split(".") as [
        keyof Links | undefined,
        "asc" | "desc" | undefined,
      ]) ?? ["title", "desc"];

      const dataPrepared = db
        .select()
        .from(links)
        .limit(per_page)
        .offset(offset)
        .where(
          // Filter links by title
          title
            ? filterColumn({
                column: links.title,
                value: title,
              })
            : undefined,
        )
        .orderBy(
          column && column in links
            ? order === "desc"
              ? desc(links[column])
              : asc(links[column])
            : desc(links.createdAt),
        )
        .prepare();

      const totalPrepared = db
        .select({
          count: count(),
        })
        .from(links)
        .where(
          // Filter links by title
          title
            ? filterColumn({
                column: links.title,
                value: title,
              })
            : undefined,
        )
        .prepare();

      const clickedLinksPrepared = db
        .select({ count: count() })
        .from(logs)
        .where(eq(logs.linkId, sql.placeholder("linkId")))
        .prepare();

      const { dataWithClicked: data, total } = await db.transaction(
        async () => {
          const data = await dataPrepared.execute();
          const dataWithClicked: LinkWithClicked[] = await Promise.all(
            data.map(async (link) => {
              const clickedLinks = await clickedLinksPrepared.execute({
                linkId: link.id,
              });

              return {
                ...link,
                clicked: clickedLinks[0]?.count ?? 0,
              };
            }),
          );
          const total = await totalPrepared
            .execute()
            .then((res) => res[0]?.count ?? 0);
          return { dataWithClicked, total };
        },
      );

      const pageCount = Math.ceil(total / per_page);
      return { data, pageCount };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error",
      );
    }
  }),

  getAllWithoutPagination: publicProcedure.query(async () => {
    try {
      const getAllPrepared = db
        .select()
        .from(links)
        .where(eq(links.isPublished, true))
        .orderBy(desc(links.createdAt))
        .prepare();
      const allLinks = await getAllPrepared.execute();

      return allLinks;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error",
      );
    }
  }),

  create: protectedProcedure
    .input(createLinkSchema)
    .mutation(async ({ input }) => {
      try {
        const slug = slugify(input.title, { lower: true });

        const existingLinksPrepared = db
          .select()
          .from(links)
          .where(eq(links.slug, sql.placeholder("slug")))
          .prepare();
        const [existingLinks] = await existingLinksPrepared.execute({ slug });
        const isSlugExist = !!existingLinks;

        if (isSlugExist) {
          throw new Error("Change the title, the slug already exists.");
        }

        const linkData = {
          title: input.title,
          slug,
          url: input.url,
          isPublished: input.isPublished,
        };
        const linkDataValidated = insertLinkSchema.parse(linkData);

        const createLinkPrepared = db
          .insert(links)
          .values(linkDataValidated)
          .$returningId()
          .prepare();
        const createdLinks = await createLinkPrepared.execute();

        return createdLinks;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
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
          .update(links)
          .set({
            isPublished: input.isPublished,
          })
          .where(eq(links.id, sql.placeholder("linkId")))
          .prepare();
        const setIsPublished = await setIsPublishedPrepared.execute({
          linkId: input.id,
        });

        return setIsPublished;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
      }
    }),

  getOneById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const getOnePrepared = db
          .select()
          .from(links)
          .where(eq(links.id, sql.placeholder("linkId")))
          .prepare();
        const [linkData] = await getOnePrepared.execute({
          linkId: input.id,
        });

        return linkData;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
      }
    }),

  update: protectedProcedure
    .input(updateLinkSchema)
    .mutation(async ({ input }) => {
      try {
        const slug = slugify(input.title, { lower: true });

        const existingLinkPrepared = db
          .select()
          .from(links)
          .where(eq(links.slug, sql.placeholder("slug")))
          .prepare();
        const [existingLink] = await existingLinkPrepared.execute({ slug });
        const isSlugExist = !!existingLink;

        if (isSlugExist && existingLink?.id !== input.id) {
          throw new Error("Change the title, the slug already exists.");
        }

        const linkData = {
          title: input.title,
          slug,
          url: input.url,
          isPublished: input.isPublished,
        };
        const linkDataValidated = insertLinkSchema.parse(linkData);

        const updateLinksPrepared = db
          .update(links)
          .set(linkDataValidated)
          .where(eq(links.id, sql.placeholder("linkId")))
          .prepare();
        const updatedLinks = await updateLinksPrepared.execute({
          linkId: input.id,
        });

        return updatedLinks;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
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
        const deleteLinksPrepared = db
          .delete(links)
          .where(eq(links.id, sql.placeholder("linkId")))
          .prepare();
        const deleteLinks = await deleteLinksPrepared.execute({
          linkId: input.id,
        });

        return deleteLinks;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
      }
    }),
});
