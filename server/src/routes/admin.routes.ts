import { Router } from "express";
import { getAdminData } from "../controllers/admin.controller";
import { verifyUser } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/", verifyUser, isAdmin, getAdminData);

export default router;