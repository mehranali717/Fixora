import Booking from "../models/Booking.js";
import TimeSlotConfig from "../models/TimeSlotConfig.js";

export const DEFAULT_TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

const DEFAULT_CAPACITY = 8;

export const toDateKey = (input) => {
  const date = input instanceof Date ? input : new Date(input);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isFriday = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.getDay() === 5;
};

export const getTimeSlotAvailability = async ({ dateKey, city }) => {
  const [config, bookings] = await Promise.all([
    TimeSlotConfig.findOne({ dateKey, city }),
    Booking.aggregate([
      {
        $match: {
          dateKey,
          "address.city": city,
          status: { $in: ["pending", "confirmed"] },
        },
      },
      { $group: { _id: "$timeSlot", booked: { $sum: 1 } } },
    ]),
  ]);

  const bookingCountMap = new Map(bookings.map((item) => [item._id, item.booked]));

  let slotLabels = [...DEFAULT_TIME_SLOTS];
  if (config?.ramadanEnabled && config?.ramadanSlots?.length) {
    slotLabels = config.ramadanSlots;
  }

  const configSlotMap = new Map((config?.slots || []).map((slot) => [slot.label, slot]));

  const slots = slotLabels.map((label) => {
    const configured = configSlotMap.get(label);
    const capacity = configured?.capacity ?? DEFAULT_CAPACITY;
    const booked = bookingCountMap.get(label) || 0;
    const blockedByCapacity = booked >= capacity;

    return {
      label,
      capacity,
      booked,
      remaining: Math.max(capacity - booked, 0),
      isBlocked: Boolean(configured?.isBlocked) || blockedByCapacity,
    };
  });

  const fridayBlocked = isFriday(dateKey) && config?.isFridayEnabled === false;

  return {
    dateKey,
    city,
    isDateBlocked: Boolean(config?.isDateBlocked || fridayBlocked),
    isFridayEnabled: config?.isFridayEnabled !== false,
    ramadanEnabled: Boolean(config?.ramadanEnabled),
    slots,
  };
};