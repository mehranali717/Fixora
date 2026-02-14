import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional().default(""),
    icon: z.string().optional().default(""),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
