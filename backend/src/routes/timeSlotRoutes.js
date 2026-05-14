import { Router } from "express";
import { getTimeSlots, upsertTimeSlotConfig } from "../controllers/timeSlotController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { upsertTimeSlotSchema } from "../validators/timeSlotSchemas.js";

const router = Router();

router.get("/", getTimeSlots);
router.post("/", protect, allowRoles("admin"), validate(upsertTimeSlotSchema), upsertTimeSlotConfig);

export default router;