const express = require("express");
const {
  addBook,
  getBooksByService,
  getUserBooks,
  getAllBookings,
  getBookingById,  

  updateBookingStatus
} = require("../controllers/bookController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a booking (Authenticated users only)
router.post("/", authenticateToken, addBook);

// Get all bookings for a specific service
router.get("/service/:serviceId", authenticateToken, getBooksByService);

// Get all bookings for the logged-in user
router.get("/my-books", authenticateToken, getUserBooks);

// ✅ Get all bookings (Admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), getAllBookings);

router.get("/:id", authenticateToken, getBookingById);


// ✅ Update booking status (Admin only)
router.put("/:id/status", authenticateToken, authorizeRoles("admin"), updateBookingStatus);

module.exports = router;
