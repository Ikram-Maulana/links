import {
  addCachedData,
  deleteProfileImage,
  getCachedData,
  updateCachedData,
  updateOrCreateCachedData,
} from "@/lib/redis";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { publicMetadata, type users } from "@/server/db/schema";
import { eq, type InferSelectModel } from "drizzle-orm";
import { z } from "zod";

type PublicMetadataProps = InferSelectModel<typeof publicMetadata>;
type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: PublicMetadataProps;
};

export const settingsRouter = createTRPCRouter({
  getDetail: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const { user } = session;

    try {
      const cachedData = await getCachedData("profileData");

      if (cachedData) {
        return cachedData as ProfileDataProps;
      }

      const detailUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, user.id),
        with: {
          publicMetadata: true,
        },
      });

      await addCachedData("profileData", detailUser as ProfileDataProps);

      return detailUser as ProfileDataProps;
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
        bio: z
          .string({
            required_error: "Bio is required",
          })
          .trim()
          .min(3, "Please enter a bio"),
        location: z
          .string({
            required_error: "Location is required",
          })
          .trim()
          .min(3, "Please enter a location"),
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
          })
          .returning();

        await Promise.all([
          updateCachedData(
            "profileData",
            user.id,
            upsertPublicMetadata[0] as unknown as PublicMetadataProps,
          ),
          updateOrCreateCachedData(
            "publicMetadata",
            upsertPublicMetadata[0] as unknown as PublicMetadataProps,
          ),
        ]);

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

  deleteImage: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;
    const { user } = session;

    try {
      const deleteImage = await ctx.db
        .update(publicMetadata)
        .set({
          avatar: null,
        })
        .where(eq(publicMetadata.userId, user.id))
        .returning();

      await deleteProfileImage();

      return deleteImage;
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
