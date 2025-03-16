import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
