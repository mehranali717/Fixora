import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const imagesField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    }

    return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()) : [];
  });

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: objectId,
    price: z.coerce.number().nonnegative(),
    duration: z.coerce.number().int().min(15),
    images: imagesField.default([]),
    isActive: z.coerce.boolean().optional().default(true),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateServiceSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).optional(),
      description: z.string().min(10).optional(),
      category: objectId.optional(),
      price: z.coerce.number().nonnegative().optional(),
      duration: z.coerce.number().int().min(15).optional(),
      images: imagesField,
      isActive: z.coerce.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: "No fields provided" }),
  params: z.object({ id: objectId }),
  query: z.object({}).optional(),
});