const mongoose = require("mongoose");
const Notification = require("../model/Notification");


exports.createNotification = async (req, res) => {
    try {
      const { userId, title, message, isRead } = req.body;
      
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
      }
  
      // Create a new notification
      const newNotification = new Notification({
        userId: new mongoose.Types.ObjectId(userId),
        title,
        message,
        isRead: isRead || false, // Default to false if not provided
      });
  
      // Save to database
      const savedNotification = await newNotification.save();
      res.status(201).json(savedNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  };

  exports.getNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      console.log("Received request for userId:", userId);
  
      const notifications = await Notification.find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(20);
  
      console.log("Fetched notifications:", notifications);
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  };
  