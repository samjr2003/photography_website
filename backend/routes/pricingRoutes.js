const express = require("express");

const router = express.Router();

const {
  getPricing,
  getAllPricing,
  createPricing,
  updatePricing,
  deletePricing,
} = require("../controllers/pricingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =========================================================
// PUBLIC
// =========================================================

router.get(
  "/",
  getPricing
);


// =========================================================
// ADMIN - GET ALL
// =========================================================

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllPricing
);


// =========================================================
// ADMIN - CREATE
// =========================================================

router.post(
  "/",
  protect,
  adminOnly,
  createPricing
);


// =========================================================
// ADMIN - UPDATE
// =========================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updatePricing
);


// =========================================================
// ADMIN - DELETE
// =========================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePricing
);


module.exports = router;