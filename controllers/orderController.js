const Order = require('../model/order');
const Service = require('../model/service');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, services } = req.body;

        // Validate services and calculate total amount
        const serviceDetails = await Service.find({ _id: { $in: services } });
        if (serviceDetails.length !== services.length) {
            return res.status(400).json({ message: 'One or more services are invalid' });
        }

        const totalAmount = serviceDetails.reduce((sum, service) => sum + service.price, 0);

        const order = new Order({
            customerName,
            customerEmail,
            services,
            totalAmount
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('services');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('services');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, services } = req.body;

        let totalAmount;
        if (services) {
            const serviceDetails = await Service.find({ _id: { $in: services } });
            if (serviceDetails.length !== services.length) {
                return res.status(400).json({ message: 'One or more services are invalid' });
            }
            totalAmount = serviceDetails.reduce((sum, service) => sum + service.price, 0);
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                customerName,
                customerEmail,
                services,
                totalAmount
            },
            { new: true, runValidators: true }
        ).populate('services');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
