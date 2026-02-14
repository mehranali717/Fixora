import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createBookingSchema = z.object({
  body: z.object({
    service: objectId,
    date: z.coerce.date(),
    timeSlot: z.string().min(2),
    address: z.string().min(5),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "completed", "cancelled"]),
  }),
  params: z.object({ id: objectId }),
  query: z.object({}).optional(),
});
