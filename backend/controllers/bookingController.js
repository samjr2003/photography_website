const Booking = require("../models/Booking");

// =========================================================
// CREATE BOOKING
// =========================================================

const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      date,
      location,
      package: bookingPackage,
      message,
    } = req.body;

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !service ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Name, email, phone, service and date are required.",
      });
    }

    // -----------------------------------------
    // Create booking
    // -----------------------------------------

    const booking = await Booking.create({
      name: name.trim(),

      email: email.trim(),

      phone: phone.trim(),

      service: service.trim(),

      date,

      location:
        location?.trim() || "",

      package:
        bookingPackage?.trim() || "",

      message:
        message?.trim() || "",

      bookingStatus: "Pending",
    });

    res.status(201).json({
      message:
        "Booking request submitted successfully.",

      booking,
    });
  } catch (error) {
    console.error(
      "Create Booking Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating booking.",
    });
  }
};


// =========================================================
// GET ALL BOOKINGS - ADMIN
// =========================================================

const getBookings = async (req, res) => {
  try {
    const bookings =
      await Booking.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get Bookings Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching bookings.",
    });
  }
};

// =========================================================
// GET BOOKING STATISTICS - ADMIN
// =========================================================

const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingBookings =
      await Booking.countDocuments({
        bookingStatus: "Pending",
      });

    const confirmedBookings =
      await Booking.countDocuments({
        bookingStatus: "Confirmed",
      });

    const rejectedBookings =
      await Booking.countDocuments({
        bookingStatus: "Rejected",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        bookingStatus: "Cancelled",
      });

    res.status(200).json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
      cancelledBookings,
    });
  } catch (error) {
    console.error(
      "Get Booking Stats Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching booking statistics.",
    });
  }
};


// =========================================================
// GET SINGLE BOOKING
// =========================================================

const getSingleBooking = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error(
      "Get Single Booking Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching booking.",
    });
  }
};


// =========================================================
// UPDATE BOOKING STATUS - ADMIN
// =========================================================

const updateBooking = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      bookingStatus,
    } = req.body;

    // -----------------------------------------
    // Validate status
    // -----------------------------------------

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Rejected",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        bookingStatus
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid booking status.",
      });
    }

    // -----------------------------------------
    // Find booking
    // -----------------------------------------

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // -----------------------------------------
    // Update status
    // -----------------------------------------

    booking.bookingStatus =
      bookingStatus;

    await booking.save();

    res.status(200).json({
      message:
        "Booking status updated successfully.",

      booking,
    });
  } catch (error) {
    console.error(
      "Update Booking Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating booking.",
    });
  }
};


// =========================================================
// DELETE BOOKING - ADMIN
// =========================================================

const deleteBooking = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      message:
        "Booking deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Booking Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting booking.",
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  createBooking,
  getBookings,
  getSingleBooking,
  getBookingStats,
  updateBooking,
  deleteBooking,
};