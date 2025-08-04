import express from "express";
import {
    createUser,
    getStaffMembers,
    getUserProfile,
    getUsers,
    loginUser,
    logoutCurrentUser,
    updateUserProfile,
} from "../controllers/userController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/").post(createUser);
router.route("/auth").post(loginUser);
router.route("/logout").post(logoutCurrentUser);
router.route("/staff").get(getStaffMembers);


router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);


router.route("/").get(protect, admin, getUsers);

export default router;
