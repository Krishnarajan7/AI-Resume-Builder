import express from "express";
import passport from "./src/config/passport.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Postman / server-to-server
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true, // Allow cookies
    })
);

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the AI Resume Builder API!",
        status: "Online",
        api_version: "1.0",
    });
});

// routes
app.use("/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

// Error handler
app.use(errorHandler);

export default app;
