import express from "express";
import {
    createService,
    deleteService,
    getServiceById,
    getServices,
    getServicesByCategory,
    updateService,
} from "../controllers/serviceController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/").get(getServices);
router.route("/category/:category").get(getServicesByCategory);
router.route("/:id").get(getServiceById);

//  (Admin only)
router.route("/").post(protect, admin, createService);
router.route("/:id").put(protect, admin, updateService);
router.route("/:id").delete(protect, admin, deleteService);

export default router;
