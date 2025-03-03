const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "pending" },
    // pickupLocation: { type: String, required: true },  
    // dropOffLocation: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
