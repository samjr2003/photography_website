const express = require("express");

const router = express.Router();

const {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// ==========================================
// PUBLIC - GET SERVICES
// ==========================================

router.get("/", getServices);



// ==========================================
// ADMIN - CREATE SERVICE
// ==========================================

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllServicesAdmin
);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createService
);

// ==========================================
// ADMIN - UPDATE SERVICE
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateService
);

// ==========================================
// ADMIN - DELETE SERVICE
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteService
);

module.exports = router;