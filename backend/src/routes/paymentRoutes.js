import { Router } from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";

const router = Router();

router.post("/checkout", protect, allowRoles("user", "admin"), createCheckoutSession);

export default router;
