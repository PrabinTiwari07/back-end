

const mongoose = require("mongoose");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

let MONGO_URI = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  console.log("🔄 Running in TEST mode: Forcing MongoDB to use cleanease_test");
  MONGO_URI = "mongodb://localhost:27017/cleanease_test"; // Force test DB
}

if (!MONGO_URI) {
  throw new Error("❌ MongoDB URI is not defined in the environment variables.");
}

console.log(`🛢️ Using MongoDB Database: ${MONGO_URI}`);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ MongoDB connected: ${MONGO_URI}`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
