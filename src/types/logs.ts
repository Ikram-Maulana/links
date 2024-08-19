import { insertLogSchema } from "@/server/db/schema";
import { z } from "zod";

export const searchLogParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
});

export const getLogsSchema = searchLogParamsSchema;

export const createLogSchema = insertLogSchema.omit({
  id: true,
  createdAt: true,
});
