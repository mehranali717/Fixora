import Service from "../models/Service.js";

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {    
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new service (admin only)
export const createService = async (req, res) => {
  try {
    const { title, subtitle, price, image, icon } = req.body;
    const service = new Service({ title, subtitle, price, image, icon });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
