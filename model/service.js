const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: false },
  description: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true }, 
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
