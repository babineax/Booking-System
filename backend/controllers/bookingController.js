import asyncHandler from "../middlewares/asyncHandler.js";
import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";
import User from "../models/userModel.js";


const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, staffMemberId, appointmentDate, startTime, customerNotes } = req.body;

  
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  
  const staffMember = await User.findById(staffMemberId);
  if (!staffMember || staffMember.role !== 'staff') {
    res.status(404);
    throw new Error('Staff member not found');
  }

  const startDateTime = new Date(`${appointmentDate}T${startTime}`);
  const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
  const endTime = endDateTime.toTimeString().slice(0, 5);

  
  const conflictingBooking = await Booking.findOne({
    staffMember: staffMemberId,
    appointmentDate: new Date(appointmentDate),
    status: { $nin: ['cancelled', 'no-show'] },
    $or: [
      {
        $and: [
          { startTime: { $lt: endTime } },
          { endTime: { $gt: startTime } }
        ]
      }
    ]
  });

  if (conflictingBooking) {
    res.status(400);
    throw new Error('Time slot is already booked');
  }

  const booking = new Booking({
    customer: req.user._id,
    service: serviceId,
    staffMember: staffMemberId,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
    customerNotes: customerNotes || '',
    totalPrice: service.price,
  });

  const createdBooking = await booking.save();
  await createdBooking.populate([
    { path: 'customer', select: 'firstName lastName email phone' },
    { path: 'service', select: 'name duration price' },
    { path: 'staffMember', select: 'firstName lastName' }
  ]);

  res.status(201).json(createdBooking);
});



const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate([
      { path: 'service', select: 'name duration price' },
      { path: 'staffMember', select: 'firstName lastName' }
    ])
    .sort({ appointmentDate: -1 });

  res.json(bookings);
});


const getAllBookings = asyncHandler(async (req, res) => {
  const { date, status, staffMember } = req.query;
  
  let query = {};
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.appointmentDate = { $gte: startDate, $lt: endDate };
  }
  
  if (status) {
    query.status = status;
  }
  
  if (staffMember) {
    query.staffMember = staffMember;
  }

  
  if (req.user.role === 'staff') {
    query.staffMember = req.user._id;
  }

  const bookings = await Booking.find(query)
    .populate([
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'service', select: 'name duration price' },
      { path: 'staffMember', select: 'firstName lastName' }
    ])
    .sort({ appointmentDate: 1, startTime: 1 });

  res.json(bookings);
});


const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate([
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'service', select: 'name duration price category' },
      { path: 'staffMember', select: 'firstName lastName' }
    ]);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }


  if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  if (req.user.role === 'staff' && booking.staffMember._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});


const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }


  if (req.user.role === 'staff' && booking.staffMember.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  if (notes) {
    booking.notes = notes;
  }

  const updatedBooking = await booking.save();
  await updatedBooking.populate([
    { path: 'customer', select: 'firstName lastName email phone' },
    { path: 'service', select: 'name duration price' },
    { path: 'staffMember', select: 'firstName lastName' }
  ]);

  res.json(updatedBooking);
});


const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  
  if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

 
  const now = new Date();
  const appointmentDateTime = new Date(`${booking.appointmentDate.toISOString().split('T')[0]}T${booking.startTime}`);
  const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);

  if (hoursDifference < 24 && req.user.role === 'customer') {
    res.status(400);
    throw new Error('Bookings can only be cancelled at least 24 hours in advance');
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();
  
  await updatedBooking.populate([
    { path: 'customer', select: 'firstName lastName email phone' },
    { path: 'service', select: 'name duration price' },
    { path: 'staffMember', select: 'firstName lastName' }
  ]);

  res.json(updatedBooking);
});


const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date, serviceId, staffMemberId } = req.query;

  if (!date || !serviceId || !staffMemberId) {
    res.status(400);
    throw new Error('Date, service ID, and staff member ID are required');
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }


  const existingBookings = await Booking.find({
    staffMember: staffMemberId,
    appointmentDate: new Date(date),
    status: { $nin: ['cancelled', 'no-show'] }
  }).select('startTime endTime');

  // For now i guess it should return basic business hours (9 AM to 6 PM) will return sometghing different later
  const businessStart = '09:00';
  const businessEnd = '18:00';
  const slotDuration = 30; 

  const availableSlots = [];
  let currentTime = businessStart;

  while (currentTime < businessEnd) {
    const currentDateTime = new Date(`${date}T${currentTime}`);
    const endDateTime = new Date(currentDateTime.getTime() + service.duration * 60000);
    const endTime = endDateTime.toTimeString().slice(0, 5);

    
    const hasConflict = existingBookings.some(booking => 
      (currentTime < booking.endTime && endTime > booking.startTime)
    );

    if (!hasConflict && endTime <= businessEnd) {
      availableSlots.push({
        startTime: currentTime,
        endTime: endTime
      });
    }

    
    const nextDateTime = new Date(currentDateTime.getTime() + slotDuration * 60000);
    currentTime = nextDateTime.toTimeString().slice(0, 5);
  }

  res.json(availableSlots);
});

export {
    cancelBooking, createBooking, getAllBookings, getAvailableSlots, getBookingById, getMyBookings, updateBookingStatus
};

