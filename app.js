
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket.js"); 
const User = require("./model/User"); 
const bcrypt = require("bcryptjs");

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

let MONGO_URI = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  console.log("🔄 Running in TEST mode: Switching to `cleanease_test`");
  MONGO_URI = "mongodb://localhost:27017/cleanease_test"; 
}

console.log(`🛢️ Using MongoDB Database: ${MONGO_URI}`);

const app = express();
const server = http.createServer(app); 

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "http://10.0.2.2:3000", "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions)); 
app.use("/uploads", express.static("public/uploads"));

initializeSocket(server);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected to: ${MONGO_URI}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const userRoutes = require("./routes/userRoute");
const serviceRoutes = require("./routes/serviceRoute");
const bookRoute = require("./routes/bookRoute");
const profileRoutes = require("./routes/profileRoute");
const notificationRoute = require("./routes/notificationRoute");
const notificationRoutes = require("./routes/notificationRoute");


app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/books", bookRoute);
app.use("/api/profile", profileRoutes);
app.use("/api", notificationRoute);
app.use("/api/notifications", notificationRoutes);


if (process.env.NODE_ENV !== "test") {
  connectDB(); 
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on:`);
    console.log(`➡️  http://localhost:${PORT} (for Web)`);
    console.log(`➡️  http://10.0.2.2:${PORT} (for Flutter Android Emulator)`);
  });

  const createAdmin = async () => {
    try {
      const existingAdmin = await User.findOne({ email: "admin@cleanease.com" });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("cleanease123", 10);
        console.log("New Hashed Password:", hashedPassword);

        const adminUser = new User({
          fullname: "Clean Ease",
          address: "Kumaripati",
          phone: "9828696552",
          email: "admin@cleanease.com",
          password: hashedPassword,
          role: "admin",
          isVerified: true,
        });
        await adminUser.save();
        console.log("Admin created successfully!");
      } else {
        console.log("Admin already exists.");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  createAdmin(); 
}

module.exports = { app, server, connectDB };
