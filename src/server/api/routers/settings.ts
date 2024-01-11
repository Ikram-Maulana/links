import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { publicMetadata } from "@/server/db/schema";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  getDetail: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const { user } = session;

    try {
      const detailUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, user.id),
        with: {
          publicMetadata: true,
        },
      });

      return detailUser;
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
        avatar: z.string().optional().nullable(),
        bio: z.string(),
        location: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const { user } = session;

      try {
        const upsertPublicMetadata = await ctx.db
          .insert(publicMetadata)
          .values({
            avatar: input.avatar,
            bio: input.bio,
            location: input.location,
            userId: user.id,
          })
          .onConflictDoUpdate({
            target: [publicMetadata.userId],
            set: {
              avatar: input.avatar,
              bio: input.bio,
              location: input.location,
            },
          });

        return upsertPublicMetadata;
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
