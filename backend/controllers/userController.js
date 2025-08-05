import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, phone, role } =
    req.body;

  if (!username || !email || !password || !firstName || !lastName) {
    throw new Error("Please fill all the required inputs");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashpassword,
    firstName,
    lastName,
    phone,
    role: role || "customer",
  });

  try {
    await newUser.save();
    const token = createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      isAdmin: newUser.isAdmin,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      const token = createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        phone: existingUser.phone,
        role: existingUser.role,
        isAdmin: existingUser.isAdmin,
        token,
      });
      return;
    }
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("logged out successfully");
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.username = req.body.username || user.username;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getStaffMembers = asyncHandler(async (req, res) => {
  const staff = await User.find({
    role: "staff",
    isActive: true,
  }).select("-password");

  res.json(staff);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(404);
      throw new Error("an admin cannot be deleted");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "user removed" });
  } else {
    res.status(404);
    throw new Error("users not found");
  }
});

export {
  createUser,
  deleteUserById,
  getStaffMembers,
  getUserProfile,
  getUsers,
  loginUser,
  logoutCurrentUser,
  updateUserProfile,
};
