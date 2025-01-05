const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/UserRoute"));

app.use("/api/orders", require("./routes/orderRoutes")); // Correctly importing order routes

app.use("/api/services", require("./routes/serviceRoutes")); // Correctly importing order routes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
