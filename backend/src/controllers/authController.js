import ms from "ms";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  hashToken,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import { env } from "../config/env.js";

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
});

const persistRefreshToken = async (userId, refreshToken) => {
  const ttl = ms(env.REFRESH_TOKEN_EXPIRES_IN);
  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + ttl),
  });
};

export const register = asyncHandler(async (req, res) => {  
  const { name, email, password, phone } = req.validated.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError("Email already exists", 409);

  const user = await User.create({ name, email, password, phone, role: "user" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.status(201).json({
    success: true,
    accessToken,
    user: buildAuthResponse(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.isBlocked) throw new AppError("Account is blocked", 403);

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new AppError("Invalid credentials", 401);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({
    success: true,
    accessToken,
    user: buildAuthResponse(user),
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw new AppError("Missing refresh token", 401);

  const payload = verifyRefreshToken(token);
  if (payload.type !== "refresh") throw new AppError("Invalid refresh token", 401);

  const tokenHash = hashToken(token);
  const session = await RefreshToken.findOne({
    user: payload.sub,
    tokenHash,
    revokedAt: null,
  });
  if (!session) throw new AppError("Refresh session not found", 401);

  const user = await User.findById(payload.sub);
  if (!user || user.isBlocked) throw new AppError("User unavailable", 401);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  session.revokedAt = new Date();
  await session.save();
  await persistRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({ success: true, accessToken, user: buildAuthResponse(user) });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(token) }, { revokedAt: new Date() });
  }
  res.clearCookie("refreshToken", refreshCookieOptions);
  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: buildAuthResponse(req.user) });
});
