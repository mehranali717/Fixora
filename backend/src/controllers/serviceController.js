import Category from "../models/Category.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const createService = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const category = await Category.findById(payload.category);
  if (!category) throw new AppError("Category not found", 404);

  const service = await Service.create(payload);
  res.status(201).json({ success: true, data: service });
});

export const getServices = asyncHandler(async (req, res) => {
  const page = Math.max(parseNumber(req.query.page, 1), 1);
  const limit = Math.min(Math.max(parseNumber(req.query.limit, 10), 1), 50);
  const skip = (page - 1) * limit;
  const query = { isActive: true };

  if (req.query.q) {
    query.$or = [
      { title: { $regex: req.query.q, $options: "i" } },
      { description: { $regex: req.query.q, $options: "i" } },
    ];
  }
  if (req.query.category) query.category = req.query.category;
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseNumber(req.query.minPrice, 0);
    if (req.query.maxPrice) query.price.$lte = parseNumber(req.query.maxPrice, Number.MAX_SAFE_INTEGER);
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === "price_asc") sort = { price: 1 };
  if (req.query.sort === "price_desc") sort = { price: -1 };
  if (req.query.sort === "rating_desc") sort = { ratingAverage: -1 };

  const [items, total] = await Promise.all([
    Service.find(query).populate("category").sort(sort).skip(skip).limit(limit),
    Service.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate("category");
  if (!service) throw new AppError("Service not found", 404);
  res.json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.validated.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new AppError("Service not found", 404);
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new AppError("Service not found", 404);
  res.json({ success: true, message: "Service deleted" });
});

export const getServiceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});
