const express = require("express");
const { registerUser, loginUser,  uploadImage,verifyOTP, resendOTP} = require("../controllers/UserController");
const upload = require("../middleware/uploads");
// const { getProfile } = require("../controllers/UserController");


const router = express.Router();

// Register User
router.post("/register", upload, registerUser);

// Login User
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// router.get("/profile", authMiddleware, getProfile);

module.exports = router;

