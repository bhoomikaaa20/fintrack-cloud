import { Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";

export const getAdminData = async (req: any, res: Response) => {
    // 🔹 Get all users
    const users = await User.find().sort({ createdAt: -1 });

    // 🔹 Get all transactions
    const txns = await Transaction.find().sort({ date: -1 });

    // 🔹 Format users
    const formattedUsers = users.map((u: any) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        created_at: u.createdAt,
    }));

    // 🔹 Format transactions
    const formattedTxns = txns.map((t: any) => ({
        id: t._id,
        user_id: t.user,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date,
        status: t.status,
    }));

    res.json({
        users: formattedUsers,
        transactions: formattedTxns,
    });
};