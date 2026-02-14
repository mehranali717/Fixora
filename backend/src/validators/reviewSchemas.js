import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createReviewSchema = z.object({
  body: z.object({
    service: objectId,
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(600).optional().default(""),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
