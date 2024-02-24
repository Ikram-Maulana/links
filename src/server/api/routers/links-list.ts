import {
  addCachedData,
  deleteCachedData,
  deleteImageLinkCache,
  deleteLinkCache,
  getCachedData,
  getOneCachedData,
  revalidateLinkCache,
  revalidateMetricsCache,
  updateCachedData,
} from "@/lib/redis";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { type InferSelectModel, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const linksListRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      let data = await getCachedData("linksList");

      if (!data) {
        const prepared = ctx.db
          .select()
          .from(linksList)
          .orderBy(desc(linksList.createdAt))
          .prepare();

        data = await prepared.all();
        await addCachedData("linksList", data);
      }

      return data as InferSelectModel<typeof linksList>[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      return {
        error: "Server Error",
      };
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        image: z.string({
          required_error: "Image is required",
        }),
        title: z
          .string({
            required_error: "Title is required",
          })
          .trim()
          .min(3, "Please enter a title"),
        url: z
          .string({
            required_error: "URL is required",
          })
          .url({
            message: "URL is invalid",
          }),
        slug: z
          .string({
            required_error: "Slug is required",
          })
          .trim()
          .min(3, {
            message: "Slug must be at least 3 characters",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const dataPrepared = ctx.db
          .insert(linksList)
          .values({
            image: input.image === "" ? null : input.image,
            title: input.title,
            url: input.url,
            slug: input.slug,
          })
          .returning()
          .prepare();
        const data = await dataPrepared.all();

        await Promise.all([
          addCachedData("linksList", data),
          revalidateMetricsCache("create"),
        ]);

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

  getOne: protectedProcedure
    .input(
      z.object({
        id: z
          .string({
            required_error: "ID is required",
          })
          .min(3, {
            message: "Please provide a valid ID",
          }),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let data = await getOneCachedData("linksList", input.id);

        if (!data) {
          const preparedById = ctx.db
            .select()
            .from(linksList)
            .where(eq(linksList.id, sql.placeholder("id")))
            .prepare();
          data = await preparedById.all({ id: input.id });

          await addCachedData("linksList", data);
        }

        return data as InferSelectModel<typeof linksList>[];
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }

        return {
          error: "Server Error",
        };
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z
          .string({
            required_error: "ID is required",
          })
          .min(3, {
            message: "Please provide a valid ID",
          }),
        image: z.string({
          required_error: "Image is required",
        }),
        title: z
          .string({
            required_error: "Title is required",
          })
          .trim()
          .min(3, "Please enter a title"),
        url: z
          .string({
            required_error: "URL is required",
          })
          .url({
            message: "URL is invalid",
          }),
        slug: z
          .string({
            required_error: "Slug is required",
          })
          .trim()
          .min(3, {
            message: "Slug must be at least 3 characters",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingDataPrepared = ctx.db
          .select()
          .from(linksList)
          .where(eq(linksList.id, sql.placeholder("id")))
          .prepare();
        const existingData = (await existingDataPrepared.all({
          id: input.id,
        })) as InferSelectModel<typeof linksList>[];

        const inputImage =
          input.image === ""
            ? { image: existingData[0]!.image }
            : { image: input.image };

        const dataPrepared = ctx.db
          .update(linksList)
          .set({
            ...inputImage,
            title: input.title,
            url: input.url,
            slug: input.slug,
            updatedAt: new Date(),
          })
          .where(eq(linksList.id, sql.placeholder("id")))
          .returning()
          .prepare();
        const data = (await dataPrepared.all({
          id: input.id,
        })) as unknown as InferSelectModel<typeof linksList>[];

        if (data && Boolean(data.length)) {
          const linkData = data[0]!;
          await Promise.all([
            updateCachedData("linksList", input.id, linkData),
            revalidateLinkCache(linkData.slug, linkData),
          ]);
        }

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

  delete: protectedProcedure
    .input(
      z.object({
        id: z
          .string({
            required_error: "ID is required",
          })
          .min(3, {
            message: "Please provide a valid ID",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const dataPrepared = ctx.db
          .delete(linksList)
          .where(eq(linksList.id, input.id))
          .returning()
          .prepare();
        const data = (await dataPrepared.all()) as unknown as InferSelectModel<
          typeof linksList
        >[];

        if (data && Boolean(data.length)) {
          const linkData = data[0]!;
          await Promise.all([
            deleteCachedData("linksList", input.id),
            deleteLinkCache(linkData.slug),
            revalidateMetricsCache("delete"),
          ]);
        }

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

  deleteImage: protectedProcedure
    .input(
      z.object({
        id: z
          .string({
            required_error: "ID is required",
          })
          .min(3, {
            message: "Please provide a valid ID",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const dataPrepared = ctx.db
          .update(linksList)
          .set({
            image: null,
          })
          .where(eq(linksList.id, sql.placeholder("id")))
          .returning()
          .prepare();
        const data = (await dataPrepared.all({
          id: input.id,
        })) as InferSelectModel<typeof linksList>[];

        if (data && Boolean(data.length)) {
          const linkData = data[0]!;
          await Promise.all([
            updateCachedData("linksList", input.id, linkData),
            deleteImageLinkCache(input.id, linkData.slug),
          ]);
        }

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
