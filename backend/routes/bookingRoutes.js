import express from "express";
import {
    cancelBooking,
    createBooking,
    getAllBookings,
    getAvailableSlots,
    getBookingById,
    getMyBookings,
    updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect, staff } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/available-slots").get(getAvailableSlots);


router.route("/").post(protect, createBooking);
router.route("/my-bookings").get(protect, getMyBookings);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/cancel").put(protect, cancelBooking);


router.route("/").get(protect, staff, getAllBookings);
router.route("/:id/status").put(protect, staff, updateBookingStatus);

export default router;
