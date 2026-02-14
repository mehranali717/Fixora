import { Router } from "express";
import { createReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/reviewSchemas.js";

const router = Router();

router.post("/", protect, allowRoles("user", "admin"), validate(createReviewSchema), createReview);

export default router;
