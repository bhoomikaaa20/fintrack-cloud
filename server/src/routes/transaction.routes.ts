import { Router } from "express";
import { getTransactions, createTransaction, deleteTransaction } from "../controllers/transaction.controller";
import { verifyUser } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", verifyUser, getTransactions);
router.post("/", verifyUser, upload.single("file"), createTransaction);
router.delete("/:id", verifyUser, deleteTransaction);

export default router;