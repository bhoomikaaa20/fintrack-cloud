import { Response } from "express";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middleware/auth.middleware";


// ✅ GET ALL
export const getTransactions = async (req: AuthRequest, res: Response) => {
    const txns = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    const formatted = txns.map((t: any) => ({
        id: t._id,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date,
        description: t.description,
        file_url: t.file_url,
        status: t.status,
    }));

    res.json({ transactions: formatted });
};

export const createTransaction = async (req: any, res: Response) => {
    const { amount, type, category, date, description } = req.body;

    const status = Number(amount) > 50000 ? "high" : "normal";

    let fileUrl: string | undefined = undefined;

    if (req.file) {
        fileUrl = `/uploads/${req.file.filename}`;
    }

    const txn = await Transaction.create({
        user: req.user.id,
        amount,
        type,
        category,
        date,
        description,
        file_url: fileUrl,
        status,
    });

    res.json(txn);
};

// ✅ DELETE
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const txn = await Transaction.findOneAndDelete({
        _id: id,
        user: req.user.id,
    });

    if (!txn) {
        return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Deleted successfully" });
};