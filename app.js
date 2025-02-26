
// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");

// // Load environment variables
// dotenv.config();

// const app = express();
// app.use(express.json());

// // Configure CORS options
// const corsOptions = {
//     origin: ["http://localhost:5173", "http://10.0.2.2:3000", "*"], // Allow frontend requests
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
// };

// app.use(cors(corsOptions)); // Apply CORS middleware

// app.use("/uploads", express.static("public/uploads"));


// // Connect to MongoDB
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.error("MongoDB connection error:", error.message);
//         process.exit(1); // Exit process on failure
//     }
// };

// connectDB();

// // Import Routes
// const userRoutes = require("./routes/UserRoute");
// // const orderRoutes = require("./routes/orderRoutes");
// const serviceRoutes = require("./routes/serviceRoute");

// // Define API Routes
// app.use("/api/users", userRoutes);
// // app.use("/api/orders", orderRoutes);
// app.use("/api/services", serviceRoutes); 


// const bookRoute = require("./routes/bookRoute");
// app.use("/api/books", bookRoute);



// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Server running on:`);
//     console.log(`➡️  http://localhost:${PORT} (for Web)`);
//     console.log(`➡️  http://10.0.2.2:${PORT} (for Flutter Android Emulator)`);
// });

// const createAdmin = async () => {
//   try {
//     const existingAdmin = await User.findOne({ email: "admin@cleanease.com" });
//     if (!existingAdmin) {
//       const hashedPassword = await bcrypt.hash("cleanease123", 10);
//       const adminUser = new User({
//         fullname: "Admin User",
//         address: "123 Admin St",
//         phone: "1234567890",
//         email: "admin@cleanease.com",
//         password: hashedPassword,
//         role: "admin",
//         isVerified: true,
//       });

//       await adminUser.save();
//       console.log("Admin created successfully!");
//     } else {
//       console.log("Admin already exists.");
//     }
//   } catch (error) {
//     console.error("Error creating admin:", error);
//   }
// };

// // Connect to MongoDB and then create the admin
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("MongoDB connected");
//     createAdmin(); // Create admin after successful connection
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// const User = require("./model/User");



const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcryptjs");
const { initializeSocket } = require("./socket.js"); // Socket initializer
const User = require("./model/User"); // Import User model

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Middleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "http://10.0.2.2:3000", "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions)); // Apply CORS middleware
app.use("/uploads", express.static("public/uploads"));

// Initialize socket.io
initializeSocket(server);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process on failure
  }
};
connectDB();

// Example REST API endpoint
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ **Import Routes (Move them BEFORE usage)**
const userRoutes = require("./routes/userRoute");
const serviceRoutes = require("./routes/serviceRoute");
const bookRoute = require("./routes/bookRoute");
// const notificationRoutes = require("./routes/notificationRoute");
const profileRoutes = require("./routes/profileRoute"); // ✅ Moved this ABOVE app.use()
const notificationRoute = require("./routes/notificationRoute"); // Ensure correct path

// ✅ **Define API Routes (After importing)**
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/books", bookRoute);
// app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes); // ✅ No more reference error!
app.use("/api", notificationRoute);


// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on:`);
  console.log(`➡️  http://localhost:${PORT} (for Web)`);
  console.log(`➡️  http://10.0.2.2:${PORT} (for Flutter Android Emulator)`);
});

// Create Admin Function
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

// Ensure the admin creation runs after MongoDB connection
createAdmin();
