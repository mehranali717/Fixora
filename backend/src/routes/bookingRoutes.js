import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema, updateBookingStatusSchema } from "../validators/bookingSchemas.js";

const router = Router();

router.post("/", protect, allowRoles("user", "admin"), validate(createBookingSchema), createBooking);
router.get("/my", protect, allowRoles("user", "admin"), getMyBookings);
router.get("/", protect, allowRoles("admin"), getAllBookings);
router.patch("/:id/status", protect, allowRoles("admin"), validate(updateBookingStatusSchema), updateBookingStatus);
router.patch("/:id/cancel", protect, allowRoles("user", "admin"), cancelBooking);

export default router;
