import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadServiceImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Image file is required", 400);
  if (!cloudinary.config().cloud_name) throw new AppError("Cloudinary is not configured", 503);

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "fixora/services",
  });
  await fs.unlink(req.file.path);

  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});
