const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controller/UserController");

const router = express.Router();

// General user actions
router.post("/register", registerUser); // User registration
router.post("/login", loginUser);       // User login


module.exports = router;
