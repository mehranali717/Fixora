import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { sendEmail } from "../services/emailService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const service = await Service.findById(payload.service);
  if (!service || !service.isActive) throw new AppError("Service not available", 404);

  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    date: payload.date,
    timeSlot: payload.timeSlot,
    address: payload.address,
    totalAmount: service.price,
  });

  res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("service")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

export const getAllBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find()
    .populate("service")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("user", "email name");
  if (!booking) throw new AppError("Booking not found", 404);

  booking.status = req.validated.body.status;
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
  if (booking.user.toString() !== req.user._id.toString()) throw new AppError("Forbidden", 403);
  if (booking.status === "completed") throw new AppError("Completed booking cannot be cancelled", 400);

  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true, data: booking });
});
