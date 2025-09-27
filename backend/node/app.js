import express from "express";
import passport from "./src/config/passport.js";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the AI Resume Builder API!",
        status: "Online",
        api_version: "1.0",
        documentation: "Available at /docs (or similar URL)",
    });
});

app.use("/auth", authRoutes);
app.use(errorHandler);

export default app;