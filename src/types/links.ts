import { insertLinkSchema, type selectLinkSchema } from "@/server/db/schema";
import { z } from "zod";

export const searchLinkParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
});

export const getLinksSchema = searchLinkParamsSchema;

export const createLinkSchema = insertLinkSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLinkSchema = insertLinkSchema.omit({
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export type LinkWithClicked = z.infer<typeof selectLinkSchema> & {
  clicked: number;
};
