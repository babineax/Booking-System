import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;
connectDB();

import bookingRoutes from "./routes/bookingRoutes.js";
import businessHoursRoutes from "./routes/businessHoursRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/business-hours", businessHoursRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Booking System API is running!" });
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
