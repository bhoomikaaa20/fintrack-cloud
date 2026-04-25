import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
import path from "path";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/admin", adminRoutes);


export default app;