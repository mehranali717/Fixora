import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../validators/categorySchemas.js";

const router = Router();

router.post("/", protect, allowRoles("admin"), validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.put("/:id", protect, allowRoles("admin"), updateCategory);
router.delete("/:id", protect, allowRoles("admin"), deleteCategory);

export default router;
