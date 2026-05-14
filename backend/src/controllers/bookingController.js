import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { env } from "../config/env.js";
import { sendEmail } from "../services/emailService.js";
import { calculateBookingPricing } from "../services/bookingPricingService.js";
import { getTimeSlotAvailability, toDateKey } from "../services/timeSlotService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const requested = new Date(date);
  requested.setHours(0, 0, 0, 0);

  return requested < today;
};

const generateBookingId = () => `FXR-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;

const ensureUniqueBookingId = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingId = generateBookingId();
    const exists = await Booking.exists({ bookingId });
    if (!exists) return bookingId;
  }

  throw new AppError("Unable to generate booking ID", 500);
};

const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: ["refunded"],
  refunded: [],
};

export const createBooking = asyncHandler(async (req, res) => {
  const payload = req.validated.body;

  const service = await Service.findById(payload.service).populate("category", "name");
  if (!service || !service.isActive) throw new AppError("Service not available", 404);

  const bookingDate = normalizeDate(payload.date);
  if (!bookingDate) throw new AppError("Invalid booking date", 400);
  if (isPastDate(bookingDate)) throw new AppError("Cannot book past dates", 400);

  const dateKey = toDateKey(bookingDate);
  const availability = await getTimeSlotAvailability({ dateKey, city: payload.address.city });

  if (availability.isDateBlocked) throw new AppError("Selected date is unavailable", 400);

  const selectedSlot = availability.slots.find((slot) => slot.label === payload.timeSlot);
  if (!selectedSlot) throw new AppError("Invalid time slot", 400);
  if (selectedSlot.isBlocked) throw new AppError("Selected time slot is fully booked or blocked", 400);

  const existingUserSlot = await Booking.exists({
    user: req.user._id,
    dateKey,
    timeSlot: payload.timeSlot,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingUserSlot) throw new AppError("You already have a booking in this time slot", 400);

  const { pricing, addOns } = calculateBookingPricing({
    basePrice: service.price,
    serviceDetails: payload.serviceDetails,
  });

  if (payload.serviceDetails.urgencyLevel === "emergency" && pricing.urgencyFee <= 0) {
    throw new AppError("Emergency booking requires additional fee", 400);
  }

  const bookingId = await ensureUniqueBookingId();
  const paymentMethod = payload.paymentMethod;
  if (paymentMethod === "cash" && !env.ALLOW_CASH_ON_SERVICE) {
    throw new AppError("Cash on service is currently unavailable", 400);
  }

  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    bookingId,
    date: bookingDate,
    dateKey,
    timeSlot: payload.timeSlot,
    address: payload.address,
    serviceDetails: {
      ...payload.serviceDetails,
      serviceType: payload.serviceDetails.serviceType || service.category?.name || service.title,
      addOns,
    },
    pricing,
    paymentMethod,
    paymentStatus: paymentMethod === "card" ? "unpaid" : "unpaid",
    status: "pending",
    images: payload.images || [],
  });

  if (req.user.email) {
    await sendEmail({
      to: req.user.email,
      subject: `Fixora booking confirmed (${booking.bookingId})`,
      html: `<p>Your booking <b>${booking.bookingId}</b> is created and currently <b>pending</b>.</p>`,
    });
  }

  res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("service")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.status) query.status = req.query.status;
  if (req.query.service) query.service = req.query.service;
  if (req.query.city) query["address.city"] = req.query.city;
  if (req.query.date) query.dateKey = req.query.date;

  const bookings = await Booking.find(query)
    .populate("service")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("user", "email name");
  if (!booking) throw new AppError("Booking not found", 404);

  const nextStatus = req.validated.body.status;
  const allowed = STATUS_TRANSITIONS[booking.status] || [];

  if (!allowed.includes(nextStatus)) {
    throw new AppError(`Cannot change status from ${booking.status} to ${nextStatus}`, 400);
  }

  booking.status = nextStatus;

  if (nextStatus === "refunded") {
    booking.paymentStatus = "refunded";
  }

  await booking.save();

  if (booking.user?.email) {
    await sendEmail({
      to: booking.user.email,
      subject: "Fixora booking status update",
      html: `<p>Hello ${booking.user.name || "Customer"}, your booking status is now <b>${booking.status}</b>.</p>`,
    });
  }

  res.json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  const isOwner = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) throw new AppError("Forbidden", 403);
  if (booking.status === "completed") throw new AppError("Completed booking cannot be cancelled", 400);

  booking.status = "cancelled";
  if (booking.paymentStatus === "paid") {
    booking.paymentStatus = "refunded";
    booking.status = "refunded";
  }

  await booking.save();
  res.json({ success: true, data: booking });
});
