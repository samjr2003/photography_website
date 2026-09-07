const express = require("express");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  getBookings,
  getBookingStats,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// ==========================================
// Admin authentication test
// ==========================================

router.get(
  "/test",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Admin authentication successful.",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

// ==========================================
// Get booking statistics
// ==========================================

router.get(
  "/booking-stats",
  protect,
  adminOnly,
  getBookingStats
);

// ==========================================
// Get all bookings
// ==========================================

router.get(
  "/bookings",
  protect,
  adminOnly,
  getBookings
);

// ==========================================
// Update booking status
// ==========================================

router.patch(
  "/bookings/:id/status",
  protect,
  adminOnly,
  updateBooking
);

// ==========================================
// Delete booking
// ==========================================

router.delete(
  "/bookings/:id",
  protect,
  adminOnly,
  deleteBooking
);

module.exports = router;