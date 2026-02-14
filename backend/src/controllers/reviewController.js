import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const updateServiceRatings = async (serviceId) => {
  const stats = await Review.aggregate([
    { $match: { service: serviceId } },
    {
      $group: {
        _id: "$service",
        avgRating: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  const next = stats[0] || { avgRating: 0, total: 0 };
  await Service.findByIdAndUpdate(serviceId, {
    ratingAverage: Number(next.avgRating.toFixed(1)),
    ratingCount: next.total,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  const { service, rating, comment } = req.validated.body;

  const completedBooking = await Booking.findOne({
    user: req.user._id,
    service,
    status: "completed",
  });
  if (!completedBooking) throw new AppError("Complete a booking before reviewing", 400);

  const review = await Review.create({
    user: req.user._id,
    service,
    rating,
    comment,
  });

  await updateServiceRatings(review.service);
  res.status(201).json({ success: true, data: review });
});
