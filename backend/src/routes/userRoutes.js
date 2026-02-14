import { Router } from "express";
import { blockUser, getUsers, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { blockUserSchema, updateProfileSchema } from "../validators/userSchemas.js";

const router = Router();

router.get("/", protect, allowRoles("admin"), getUsers);
router.patch("/:id/block", protect, allowRoles("admin"), validate(blockUserSchema), blockUser);
router.patch("/me", protect, validate(updateProfileSchema), updateProfile);

export default router;
