const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const registerUser = async (req, res) => {
  try {
    const { fullname, address, phone, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 1000);  

     let imagePath = "";
     if (req.file) {
       imagePath = `/uploads/${req.file.filename}`; 
     }

    user = new User({
      fullname,
      address,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
      image: imagePath,
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

    const token = jwt.sign(
      { id: user._id, role: user.role },  
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,  
    });

  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
      const users = await User.find().select("-password");
      if (!users || users.length === 0) {
          return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json(users);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};


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


const updateUser = async (req, res) => {
  try {
    const { fullname, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullname, address, phone },
      { new: true, runValidators: true } 
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};




const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;  

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

          const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error." });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); 
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};



module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changePassword, 
  forgotPassword

};
