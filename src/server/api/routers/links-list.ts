import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const linksListRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
        const data = await ctx.db
          .insert(linksList)
          .values({
            image: input.image,
            title: input.title,
            url: input.url,
            slug: input.slug,
          })
          .returning();

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
        const data = await ctx.db
          .select()
          .from(linksList)
          .where(eq(linksList.id, input.id));

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "ID is required",
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
        const inputImage = input.image !== "" ? { image: input.image } : {};

        const data = await ctx.db
          .update(linksList)
          .set({
            ...inputImage,
            title: input.title,
            url: input.url,
            slug: input.slug,
            updatedAt: new Date(),
          })
          .where(eq(linksList.id, input.id))
          .returning();

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
        id: z.string({
          required_error: "ID is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(linksList)
          .where(eq(linksList.id, input.id))
          .returning();

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
