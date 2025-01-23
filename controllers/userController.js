const User = require("../model/User");
const generateToken = require("../utils/generateToken");
const { hashPassword, matchPassword } = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");


// Register User
const registerUser = async (req, res) => {
  const { fullname, address, phone, email, password, confirm_password } = req.body;
  // Validate password confirmation
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    fullname,
    address,
    phone, // Save phone here
    email,
    password: hashedPassword,
    confirm_password, // Add confirm_password to match the schema
  });
  res.status(201).json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id),
  });
};


// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await matchPassword(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
  userSchema.pre("save", function (next) {
    if (this.password !== this.confirm_password) {
      return next(new Error("Passwords do not match"));
    }
    next();
  });

};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Admins can see all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: "User not found" });
};

// Delete User
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) res.json({ message: "User deleted successfully" });
  else res.status(404).json({ message: "User not found" });
};

const getProfile = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Debug
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, getUserById, deleteUser };
