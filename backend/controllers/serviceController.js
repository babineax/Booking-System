import asyncHandler from "../middlewares/asyncHandler.js";
import Service from "../models/serviceModel.js";


const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).populate('staffMembers', 'firstName lastName');
  res.json(services);
});


const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('staffMembers', 'firstName lastName');
  
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});


const createService = asyncHandler(async (req, res) => {
  const { name, description, duration, price, category, staffMembers } = req.body;

  const service = new Service({
    name,
    description,
    duration,
    price,
    category,
    staffMembers: staffMembers || [],
  });

  const createdService = await service.save();
  await createdService.populate('staffMembers', 'firstName lastName');
  
  res.status(201).json(createdService);
});


const updateService = asyncHandler(async (req, res) => {
  const { name, description, duration, price, category, staffMembers, isActive } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    service.name = name || service.name;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.category = category || service.category;
    service.staffMembers = staffMembers !== undefined ? staffMembers : service.staffMembers;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    await updatedService.populate('staffMembers', 'firstName lastName');
    
    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});


const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
  
    service.isActive = false;
    await service.save();
    res.json({ message: 'Service deactivated' });
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});


const getServicesByCategory = asyncHandler(async (req, res) => {
  const services = await Service.find({ 
    category: req.params.category, 
    isActive: true 
  }).populate('staffMembers', 'firstName lastName');
  
  res.json(services);
});

export {
    createService, deleteService, getServiceById, getServices, getServicesByCategory, updateService
};

