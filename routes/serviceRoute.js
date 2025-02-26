// const express = require("express");
// const {
//   addService,
//   getAllServices,
//   deleteService,
//   updateService,
// } = require("../controllers/serviceController");
// const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploads"); // Import upload middleware

// const router = express.Router();

// // Admin-only routes
// router.post(
//   "/",
//   authenticateToken,
//   authorizeRoles("admin"),
//   upload.single("image"), // Proper usage of upload middleware
//   addService
// );

// router.put(
//   "/:id",
//   authenticateToken,
//   authorizeRoles("admin"),
//   upload.single("image"), // Proper usage of upload middleware
//   updateService
// );

// // Public route to get all services
// router.get("/", getAllServices);

// // router.get("/:id", serviceController.getServiceById); // Get a single service by ID


// // Admin-only route to delete a service
// router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteService);

// module.exports = router;



const express = require("express");
const {
  addService,
  getAllServices,
  getServiceById,  // Import getServiceById
  deleteService,
  updateService,
} = require("../controllers/serviceController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploads");

const router = express.Router();

// Public routes
router.get("/", getAllServices); // Get all services
router.get("/:id", getServiceById); // Get a single service by ID

// Admin-only routes
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"), // Upload middleware for a single image
  addService
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"), // Upload middleware for a single image
  updateService
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteService
);

module.exports = router;
