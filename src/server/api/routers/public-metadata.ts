import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const publicMetadataRouter = createTRPCRouter({
  available: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const { user } = session;

    try {
      const availablePublicMetadata =
        await ctx.db.query.publicMetadata.findFirst({
          where: (publicMetadata, { eq }) => eq(publicMetadata.userId, user.id),
        });

      return availablePublicMetadata;
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
