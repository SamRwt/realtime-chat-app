import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
