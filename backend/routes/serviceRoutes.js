import express from "express";
import { createService, getServiceById, getServices } from "../controllers/serviceController.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();


router.get("/", getServices);
router.get("/:id", getServiceById);

// only admin can create service
router.post("/create", authMiddleware, isAdmin, createService);

// public route
router.get("/", getServices);

export default router;
