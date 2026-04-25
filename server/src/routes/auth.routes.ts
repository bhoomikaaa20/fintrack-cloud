import { Router } from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller";
import { verifyUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyUser, getMe);

export default router;