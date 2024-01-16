import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { linksList } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

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

  create: protectedProcedure
    .input(
      z.object({
        image: z.string({
          required_error: "Image is required",
        }),
        title: z.string({
          required_error: "Title is required",
        }),
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
});
