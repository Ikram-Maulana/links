import { addCachedData, getCachedData } from "@/lib/redis";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type users, type publicMetadata } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type PublicMetadataProps = InferSelectModel<typeof publicMetadata>;
type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: PublicMetadataProps;
};

export const publicMetadataRouter = createTRPCRouter({
  available: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const { user } = session;

    try {
      const cachedData = await getCachedData("publicMetadata");

      if (cachedData) {
        return cachedData;
      }

      const availablePublicMetadata =
        await ctx.db.query.publicMetadata.findFirst({
          where: (publicMetadata, { eq }) => eq(publicMetadata.userId, user.id),
        });

      await addCachedData(
        "publicMetadata",
        availablePublicMetadata as PublicMetadataProps,
      );

      return availablePublicMetadata as InferSelectModel<
        typeof publicMetadata
      > | null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      return {
        error: "Server Error",
      };
    }
  }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    try {
      const cachedData = await getCachedData("profileData");

      if (cachedData) {
        return cachedData;
      }

      const profileData = await ctx.db.query.users.findFirst({
        with: {
          publicMetadata: true,
        },
      });

      await addCachedData("profileData", profileData as ProfileDataProps);

      console.log(profileData, "profileData");

      return profileData as
        | (InferSelectModel<typeof users> & {
            publicMetadata: InferSelectModel<typeof publicMetadata>;
          })
        | null;
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
