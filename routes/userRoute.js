// const express = require("express");
// const router = express.Router();
// const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware"); // Ensure the path is correct

// const { registerUser, loginUser,  uploadImage,verifyOTP, resendOTP, getAllUsers, deleteUser, updateUser} = require("../controllers/UserController");
// const upload = require("../middleware/uploads");
// // const { getProfile } = require("../controllers/UserController");

// // Register User
// router.post("/register", upload.single("image"), registerUser);

// // Login User
// router.post("/login", loginUser);
// router.post("/register", registerUser);
// router.post("/verify-otp", verifyOTP);
// router.post("/resend-otp", resendOTP);

// // router.get("/profile", authMiddleware, getProfile);

// // router.get("/api/users", adminAuth, getAllUsers);

// router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);

// router.delete(
//   "/:id",
//   authenticateToken,
//   authorizeRoles("admin"),
//   deleteUser
// );

// router.put("/:id", updateUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware"); 
const { registerUser, loginUser, uploadImage, verifyOTP, resendOTP, getAllUsers, deleteUser, updateUser, changePassword } = require("../controllers/userController");
const upload = require("../middleware/uploads");
const User = require("../model/User");

router.post("/register", upload.single("image"), registerUser);

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

router.post("/change-password", authenticateToken, changePassword);


router.put("/:id", updateUser);

module.exports = router;
