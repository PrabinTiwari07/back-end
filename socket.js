const { Server } = require("socket.io");
const Notification = require("./model/Notification");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for send_notification event from the client
    socket.on("send_notification", async (data) => {
      console.log("Notification received:", data);

      try {
        // Save notification to the database
        const newNotification = new Notification({
          userId: data.userId,  // Replace with the actual user ID
          message: data.message,
          type: data.type || "system",  // Default to 'system' if not provided
        });

        await newNotification.save();

        // Broadcast the notification to all connected users (optional)
        io.emit("receive_notification", newNotification);
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIOInstance = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized.");
  }
  return io;
};

module.exports = { initializeSocket, getIOInstance };
