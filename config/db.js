const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/cleanease");
        console.log("Connected to mongodb")
    } catch (e) {
        console.log("Not connectd")
    }
}

module.exports = connectDB;