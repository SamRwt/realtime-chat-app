import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    connectDB();
});

app.use("/api/auth", authRouter);