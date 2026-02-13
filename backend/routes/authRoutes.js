import express from "express";
import { register, login } from "../controllers/authController.js";
import {authMiddleware} from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

// Admin-only route
router.get("/admin", authMiddleware, role(["admin"]), (req, res) => {
  res.json({ message: "Admin dashboard access granted ✅" });
});

export default router;
