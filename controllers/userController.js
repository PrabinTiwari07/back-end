const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ----------------------------
// User Registration with OTP
// ----------------------------
const registerUser = async (req, res) => {
  try {
    const { fullname, address, phone, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 1000); // 1 min expiry

    user = new User({
      fullname,
      address,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your OTP code is: ${otp}. It is valid for 1 minute.`,
    });

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// ----------------------------
// Verify OTP
// ----------------------------
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP", error: err.message });
  }
};

// ----------------------------
// Resend OTP
// ----------------------------
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend Verification Code",
      text: `Your new OTP code is: ${otp}. It is valid for 1 minute.`,
    });

    res.status(200).json({ message: "New OTP sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Error resending OTP", error: err.message });
  }
};

// ----------------------------
// Login User
// ----------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// ----------------------------
// Get All Users (Without Password)
// ----------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// ----------------------------
// Get User By ID (Without Password)
// ----------------------------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// ----------------------------
// Delete User
// ----------------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// ----------------------------
// Export All Functions
// ----------------------------
module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
