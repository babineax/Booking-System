import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Staff-specific fields
    specialties: [{
      type: String,
    }], // For staff members
    bio: {
      type: String,
    }, // For staff members
    
    // Customer-specific fields
    preferences: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
