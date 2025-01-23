const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/UserController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;
