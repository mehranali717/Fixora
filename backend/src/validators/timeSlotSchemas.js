import { z } from "zod";

const citySchema = z.enum(["Dubai", "Abu Dhabi"]);
const slotLabel = z.enum([
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
]);

export const upsertTimeSlotSchema = z.object({
  body: z.object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    city: citySchema,
    isDateBlocked: z.coerce.boolean().optional().default(false),
    isFridayEnabled: z.coerce.boolean().optional().default(true),
    ramadanEnabled: z.coerce.boolean().optional().default(false),
    ramadanSlots: z.array(slotLabel).optional().default([]),
    slots: z
      .array(
        z.object({
          label: slotLabel,
          capacity: z.coerce.number().int().min(0).default(8),
          isBlocked: z.coerce.boolean().optional().default(false),
        })
      )
      .optional()
      .default([]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});