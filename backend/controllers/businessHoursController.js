import asyncHandler from "../middlewares/asyncHandler.js";
import BusinessHours from "../models/businessHoursModel.js";

// @desc    Get business hours for a staff member
// @route   GET /api/business-hours/:staffId
// @access  Public
const getBusinessHours = asyncHandler(async (req, res) => {
  const businessHours = await BusinessHours.find({ 
    staffMember: req.params.staffId 
  }).populate('staffMember', 'firstName lastName');

  res.json(businessHours);
});

// @desc    Create/Update business hours for a staff member
// @route   POST /api/business-hours
// @access  Private/Staff/Admin
const setBusinessHours = asyncHandler(async (req, res) => {
  const { staffMemberId, schedule } = req.body;

  // Verify user can set hours for this staff member
  if (req.user.role === 'staff' && req.user._id.toString() !== staffMemberId) {
    res.status(403);
    throw new Error('Not authorized to set hours for this staff member');
  }

  // Delete existing hours for this staff member
  await BusinessHours.deleteMany({ staffMember: staffMemberId });

  // Create new hours
  const businessHoursPromises = schedule.map(daySchedule => {
    return BusinessHours.create({
      ...daySchedule,
      staffMember: staffMemberId
    });
  });

  const businessHours = await Promise.all(businessHoursPromises);
  
  res.status(201).json(businessHours);
});

// @desc    Get all staff business hours
// @route   GET /api/business-hours
// @access  Public
const getAllBusinessHours = asyncHandler(async (req, res) => {
  const businessHours = await BusinessHours.find({})
    .populate('staffMember', 'firstName lastName')
    .sort({ staffMember: 1, dayOfWeek: 1 });

  // Group by staff member
  const groupedHours = businessHours.reduce((acc, hour) => {
    const staffId = hour.staffMember._id.toString();
    if (!acc[staffId]) {
      acc[staffId] = {
        staffMember: hour.staffMember,
        schedule: []
      };
    }
    acc[staffId].schedule.push(hour);
    return acc;
  }, {});

  res.json(Object.values(groupedHours));
});

export {
    getAllBusinessHours, getBusinessHours,
    setBusinessHours
};

