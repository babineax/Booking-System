import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// Protect routes - user must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // read jwt token from 'jwt cookie'
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authenticated, token failed");
    }
  } else {
    res.status(401);
    throw new Error("not authenticated token failed ");
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

// Staff middleware (includes admin)
const staff = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin' || req.user.isAdmin)) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as staff');
  }
});

// Legacy authenticate export for backward compatibility
const authenticate = protect;

export { admin, authenticate, protect, staff };

