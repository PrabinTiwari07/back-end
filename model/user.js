const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  image : {type: String, required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: { type: String },
  otpExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
