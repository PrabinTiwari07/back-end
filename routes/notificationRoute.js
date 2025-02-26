const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// ✅ Route to create a notification
router.post("/notifications", notificationController.createNotification);

// ✅ Route to get notifications for a specific user
router.get("/notifications/:userId", notificationController.getNotifications);

module.exports = router;
