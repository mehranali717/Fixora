import { Router } from "express";
import { getAnalytics, updateServicePricing } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";

const router = Router();

router.get("/analytics", protect, allowRoles("admin"), getAnalytics);
router.patch("/pricing/:id", protect, allowRoles("admin"), updateServicePricing);

export default router;
