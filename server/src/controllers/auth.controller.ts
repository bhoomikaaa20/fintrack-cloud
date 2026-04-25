import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const createToken = (user: any) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // 🔴 check missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // 🔴 check existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.json({
            user,
            roles: [user.role],
        });

    } catch (err) {
        console.error("Signup error:", err); // 👈 VERY IMPORTANT
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = createToken(user);

    res.cookie("token", token, { httpOnly: true });

    res.json({
        user,
        roles: [user.role],
    });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};

export const getMe = async (req: any, res: Response) => {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
        user,
        roles: [user?.role],
    });
};