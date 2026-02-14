import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServiceReviews,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createServiceSchema, updateServiceSchema } from "../validators/serviceSchemas.js";

const router = Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.get("/:id/reviews", getServiceReviews);
router.post("/", protect, allowRoles("admin"), validate(createServiceSchema), createService);
router.put("/:id", protect, allowRoles("admin"), validate(updateServiceSchema), updateService);
router.delete("/:id", protect, allowRoles("admin"), deleteService);

export default router;
