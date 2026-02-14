import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      phone: z.string().min(6).optional(),
      email: z.string().email().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: "No fields provided" }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const blockUserSchema = z.object({
  body: z.object({ isBlocked: z.boolean().optional().default(true) }),
  params: z.object({ id: objectId }),
  query: z.object({}).optional(),
});
