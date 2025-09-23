import express from "express";
import passport from "./src/config/passport.js";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use(errorHandler);

export default app;
