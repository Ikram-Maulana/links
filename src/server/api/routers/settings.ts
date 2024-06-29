import {
  addCachedData,
  deleteProfileImage,
  getCachedData,
  updateCachedData,
  updateOrCreateCachedData,
} from "@/lib/redis";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { publicMetadata, type users } from "@/server/db/schema";
import { eq, sql, type InferSelectModel } from "drizzle-orm";
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

      const preparedDetail = ctx.db.query.users
        .findFirst({
          where: (users, { eq }) => eq(users.id, sql.placeholder("id")),
          with: {
            publicMetadata: true,
          },
        })
        .prepare();

      const detailUser = await preparedDetail.all({ id: user.id });
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
        const getExistingPublicMetadataById = ctx.db.query.publicMetadata
          .findFirst({
            where: (publicMetadata, { eq }) =>
              eq(publicMetadata.userId, sql.placeholder("id")),
          })
          .prepare();
        const existingPublicMetadata = (await getExistingPublicMetadataById.all(
          { id: user.id },
        )) as unknown as InferSelectModel<typeof publicMetadata>[];

        const upsertPublicMetadataPrepared = ctx.db
          .insert(publicMetadata)
          .values({
            avatar: input.avatar === "" ? null : input.avatar,
            bio: input.bio,
            location: input.location,
            userId: user.id,
          })
          .onConflictDoUpdate({
            target: [publicMetadata.userId],
            set: {
              avatar:
                input.avatar === ""
                  ? existingPublicMetadata && Boolean(existingPublicMetadata)
                    ? existingPublicMetadata[0]?.avatar
                    : null
                  : input.avatar,
              bio: input.bio,
              location: input.location,
            },
          })
          .returning()
          .prepare();
        const upsertPublicMetadata = await upsertPublicMetadataPrepared.all();

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
      const deleteImagePrepared = ctx.db
        .update(publicMetadata)
        .set({
          avatar: null,
        })
        .where(eq(publicMetadata.userId, user.id))
        .returning()
        .prepare();

      const [deleteImage] = await Promise.all([
        deleteImagePrepared.all(),
        deleteProfileImage(),
      ]);

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
