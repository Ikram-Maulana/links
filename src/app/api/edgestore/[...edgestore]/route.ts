import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { z } from "zod";

export const runtime = "edge";
export const preferredRegion = ["sin1"];

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 4, // 4MB
      accept: ["image/*"],
    })
    .input(
      z.object({
        type: z.enum(["links", "profile"]),
      }),
    )
    .path(({ input }) => [{ type: input.type }])
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete", ctx, fileInfo);
      return true; // allow delete
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
