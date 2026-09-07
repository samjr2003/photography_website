const express = require("express");

const router = express.Router();

const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =========================================================
// PUBLIC
// =========================================================

router.get(
  "/",
  getTestimonials
);


// =========================================================
// ADMIN - GET ALL
// =========================================================

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllTestimonials
);


// =========================================================
// ADMIN - CREATE
// =========================================================

router.post(
  "/",
  protect,
  adminOnly,
  createTestimonial
);


// =========================================================
// ADMIN - UPDATE
// =========================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateTestimonial
);


// =========================================================
// ADMIN - DELETE
// =========================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTestimonial
);


module.exports = router;