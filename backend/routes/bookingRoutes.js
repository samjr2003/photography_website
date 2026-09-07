const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  getSingleBooking,
  getBookingStats,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =========================================================
// PUBLIC
// =========================================================

// Customer submits booking
router.post(
  "/",
  createBooking
);


// =========================================================
// ADMIN
// =========================================================

// Get all booking statistics
// IMPORTANT: This MUST be before /:id
router.get(
  "/stats",
  protect,
  adminOnly,
  getBookingStats
);


// Get all bookings
router.get(
  "/",
  protect,
  adminOnly,
  getBookings
);


// Get single booking
router.get(
  "/:id",
  protect,
  adminOnly,
  getSingleBooking
);


// Update booking status
router.put(
  "/:id",
  protect,
  adminOnly,
  updateBooking
);


// Delete booking
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBooking
);


module.exports = router;