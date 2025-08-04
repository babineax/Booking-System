import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['haircut', 'coloring', 'styling', 'treatment', 'consultation', 'other'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    staffMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }], // Staff members who can provide this service
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
