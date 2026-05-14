import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const citySchema = z.enum(["Dubai", "Abu Dhabi"]);
const propertyTypeSchema = z.enum(["apartment", "villa", "office"]);
const timeSlotSchema = z.enum([
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
]);

export const createBookingSchema = z.object({
  body: z.object({
    service: objectId,
    serviceVariant: z.string().optional().default(""),
    date: z.coerce.date(),
    timeSlot: timeSlotSchema,
    paymentMethod: z.enum(["card", "cash"]),
    address: z.object({
      propertyType: propertyTypeSchema,
      fullAddress: z.string().min(8),
      landmark: z.string().optional().default(""),
      city: citySchema,
    }),
    serviceDetails: z.object({
      serviceType: z.string().min(2),
      serviceVariant: z.string().optional().default(""),
      rooms: z.coerce.number().int().min(1).optional().default(1),
      cleaners: z.coerce.number().int().min(1).optional().default(1),
      bringMaterials: z.coerce.boolean().optional().default(false),
      insideCabinets: z.coerce.boolean().optional().default(false),
      ironingRequired: z.coerce.boolean().optional().default(false),
      issueType: z.string().optional().default(""),
      urgencyLevel: z.enum(["standard", "emergency"]).optional().default("standard"),
      itemsToFix: z.coerce.number().int().min(1).optional().default(1),
      tasksDescription: z.string().optional().default(""),
      specialInstructions: z.string().optional().default(""),
    }),
    images: z.array(z.string()).optional().default([]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled", "refunded"]),
  }),
  params: z.object({ id: objectId }),
  query: z.object({}).optional(),
});