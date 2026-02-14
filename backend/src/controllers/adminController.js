import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [totalUsers, totalBookings, revenueAgg, recentBookings, servicePerformance] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Booking.find()
      .populate("service", "title")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5),
    Booking.aggregate([
      { $group: { _id: "$service", bookings: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      { $project: { title: "$service.title", bookings: 1, revenue: 1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalBookings,
      revenue: revenueAgg[0]?.total || 0,
      recentBookings,
      servicePerformance,
    },
  });
});

export const updateServicePricing = asyncHandler(async (req, res) => {
  const { price } = req.body;
  if (typeof price !== "number" || price < 0) throw new AppError("Invalid price", 400);

  const service = await Service.findByIdAndUpdate(req.params.id, { price }, { new: true });
  if (!service) throw new AppError("Service not found", 404);

  res.json({ success: true, data: service });
});
