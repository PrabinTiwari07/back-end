

const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.createNotification);

router.get("/:userId", notificationController.getNotifications);

router.put("/:id/read", notificationController.markNotificationAsRead);

router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
