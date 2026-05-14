import TimeSlotConfig from "../models/TimeSlotConfig.js";
import { getTimeSlotAvailability } from "../services/timeSlotService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTimeSlots = asyncHandler(async (req, res) => {
  const { date, city } = req.query;

  if (!date || !city) {
    throw new AppError("date and city query params are required", 400);
  }

  const availability = await getTimeSlotAvailability({ dateKey: date, city });
  res.json({ success: true, data: availability });
});

export const upsertTimeSlotConfig = asyncHandler(async (req, res) => {
  const payload = req.validated.body;

  const config = await TimeSlotConfig.findOneAndUpdate(
    { dateKey: payload.dateKey, city: payload.city },
    {
      $set: {
        dateKey: payload.dateKey,
        city: payload.city,
        isDateBlocked: payload.isDateBlocked,
        isFridayEnabled: payload.isFridayEnabled,
        ramadanEnabled: payload.ramadanEnabled,
        ramadanSlots: payload.ramadanSlots,
        slots: payload.slots,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json({ success: true, data: config });
});