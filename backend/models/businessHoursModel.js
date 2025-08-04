import mongoose from "mongoose";

const businessHoursSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String, 
      required: function() { return this.isOpen; },
    },
    closeTime: {
      type: String, 
      required: function() { return this.isOpen; },
    },
    breakStart: {
      type: String, 
    },
    breakEnd: {
      type: String,
    },
    staffMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);


businessHoursSchema.index({ dayOfWeek: 1, staffMember: 1 }, { unique: true });

const BusinessHours = mongoose.model("BusinessHours", businessHoursSchema);

export default BusinessHours;
