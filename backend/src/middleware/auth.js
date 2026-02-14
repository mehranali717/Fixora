import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) throw new AppError("Unauthorized", 401);

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) throw new AppError("User not found", 401);
  if (user.isBlocked) throw new AppError("Your account is blocked", 403);

  req.user = user;
  next();
});
