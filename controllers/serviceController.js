const Service = require("../model/service");  

exports.addService = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;  
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newService = new Service({
      title,
      description,
      category,
      price,
      image
    });

    await newService.save();
    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Error adding service", error: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error: error.message });
  }
};



exports.updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category, price } = req.body;
      let image = "";
  
      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }
  
      const updatedFields = {
        title,
        description,
        category,
        price,
      };
  
      if (image) {
        updatedFields.image = image;
      }
  
      const updatedService = await Service.findByIdAndUpdate(id, updatedFields, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.status(200).json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
      res.status(500).json({ message: "Error updating service", error: error.message });
    }
  };
  

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};


