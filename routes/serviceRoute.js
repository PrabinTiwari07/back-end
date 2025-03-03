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

// router.post(
//   "/",
//   authenticateToken,
//   authorizeRoles("admin"),
//   upload.single("image"), 
//   addService
// );

// router.put(
//   "/:id",
//   authenticateToken,
//   authorizeRoles("admin"),
//   upload.single("image"), 
//   updateService
// );

// router.get("/", getAllServices);

// // router.get("/:id", serviceController.getServiceById); 


// router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteService);

// module.exports = router;



const express = require("express");
const {
  addService,
  getAllServices,
  getServiceById, 
  deleteService,
  updateService,
} = require("../controllers/serviceController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploads");

const router = express.Router();

router.get("/", getAllServices); 
router.get("/:id", getServiceById); 

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"), 
  addService
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"), 
  updateService
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteService
);

module.exports = router;
