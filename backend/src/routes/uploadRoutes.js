import { Router } from "express";
import { uploadServiceImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import allowRoles from "../middleware/rbac.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/service-image", protect, allowRoles("admin"), upload.single("image"), uploadServiceImage);

export default router;
