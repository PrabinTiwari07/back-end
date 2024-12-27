const Service = require('../model/service');

// Create a new service
exports.createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const service = new Service({ name, description, price });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
