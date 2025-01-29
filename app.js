// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// const corsOptions = {
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//     // maxAge: 3600, // Maximum age of the preflight request cache
// };
// app.use(cors(corsOptions));

// // Routes
// app.use("/api/users", require("./routes/UserRoute"));

// app.use("/api/orders", require("./routes/orderRoutes"));

// app.use("/api/services", require("./routes/serviceRoutes"));


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS options
const corsOptions = {
    origin: ["http://localhost:5173"], // Allow frontend requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware

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

// Import Routes
const userRoutes = require("./routes/UserRoute");
// const orderRoutes = require("./routes/orderRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");

// Define API Routes
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/services", serviceRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
