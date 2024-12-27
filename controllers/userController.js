const User = require("../model/user");
const generateToken = require("../utils/generateToken");
const { hashPassword, matchPassword } = require("../utils/hashPassword");


// Register User
const registerUser = async (req, res) => {
  const { fname, lname, email, phno, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ fname, lname, email, phno, password: hashedPassword });
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
};

// Get All Users
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
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

module.exports = { registerUser, loginUser, getAllUsers, getUserById, deleteUser };
