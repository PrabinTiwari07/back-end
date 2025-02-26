const express = require("express");
const multer = require("multer");
const path = require("path");
const { getProfile, updateProfile, uploadProfileImage } = require("../controllers/profileController");

const router = express.Router();

// ✅ Set storage destination to `public/uploads/`
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // ✅ Save images inside `public/uploads/`
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp + extension
  }
});

const upload = multer({ storage: storage });

// ✅ Routes (they're below the `upload` initialization)
router.get("/:userId", getProfile);
router.put("/:userId", upload.single("file"), updateProfile);
router.post("/:userId/upload", upload.single("file"), uploadProfileImage);

module.exports = router;
