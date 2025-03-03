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

router.post("/", authenticateToken, addBook);

router.get("/service/:serviceId", authenticateToken, getBooksByService);

router.get("/my-books", authenticateToken, getUserBooks);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllBookings);

router.get("/:id", authenticateToken, getBookingById);


router.put("/:id/status", authenticateToken, authorizeRoles("admin"), updateBookingStatus);

module.exports = router;
