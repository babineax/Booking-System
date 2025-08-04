import express from "express";
import {
    getAllBusinessHours,
    getBusinessHours,
    setBusinessHours,
} from "../controllers/businessHoursController.js";
import { protect, staff } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.route("/").get(getAllBusinessHours);
router.route("/:staffId").get(getBusinessHours);


router.route("/").post(protect, staff, setBusinessHours);

export default router;
