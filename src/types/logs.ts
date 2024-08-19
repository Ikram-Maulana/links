import { insertLogSchema } from "@/server/db/schema";

export const createLogSchema = insertLogSchema.omit({
  id: true,
  createdAt: true,
});
