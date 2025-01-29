const express = require("express");
const { registerUser, loginUser,  verifyOTP, resendOTP} = require("../controllers/UserController");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;


// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   deleteUser,
// } = require("../controllers/UserController");
// const { sendEmail } = require("../utils/emailService");
// const User = require("../model/User");
// const bcrypt = require("bcrypt");

// const router = express.Router();

// const verificationCodes = {}; // Temporary store for verification codes

// // Register User
// router.post("/register", async (req, res) => {
//   const { fullname, address, phone, email, password, confirm_password } = req.body;

//   try {
//     // Check if the user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Generate hashed password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);
//     // Generate a 6-digit verification code
//     const verificationCode = Math.floor(100000 + Math.random() * 900000);

//     // Save the user to the database as unverified
//     const newUser = await User.create({
//       fullname,
//       address,
//       phone,
//       email,
//       password: hashedPassword,
//       confirm_password:hashedConfirmPassword,
//       isVerified: false,
//     });

//     // Temporarily store the verification code
//     verificationCodes[email] = verificationCode;

//     // Send the email
//     const subject = "Verify Your Email Address";
//     const text = `Your email verification code is: ${verificationCode}`;
//     const html = `<p>Your email verification code is: <strong>${verificationCode}</strong></p>`;

//     await sendEmail(email, subject, text, html);

//     res.status(201).json({
//       message: "User registered successfully. Please verify your email.",
//       userId: newUser._id,
//     });
//   } catch (error) {
//     console.error("Error registering user:", error.message);
//     res.status(500).json({ message: "Error registering user." });
//   }
// });

// // Verify Email
// router.post("/verify-email", async (req, res) => {
//   const { email, code } = req.body;

//   try {
//     if (verificationCodes[email] && parseInt(code) === verificationCodes[email]) {
//       // Mark the user as verified
//       const user = await User.findOneAndUpdate(
//         { email },
//         { isVerified: true },
//         { new: true }
//       );

//       delete verificationCodes[email]; // Remove code after successful verification

//       res.status(200).json({ message: "Email verified successfully!", user });
//     } else {
//       res.status(400).json({ message: "Invalid or expired verification code." });
//     }
//   } catch (error) {
//     console.error("Error verifying email:", error.message);
//     res.status(500).json({ message: "Error verifying email." });
//   }
// });

// // Login User
// router.post("/login", loginUser);


// // Dynamic Routes
// router.get("/:id", getUserById);
// router.delete("/:id", deleteUser);

// // Admin Routes (if needed)
// router.get("/", getAllUsers);

// module.exports = router;
