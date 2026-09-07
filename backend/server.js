const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const pricingRoutes = require("./routes/pricingRoutes");

// ==============================
// Connect MongoDB
// ==============================

connectDB();

// ==============================
// Middleware
// ==============================

app.use(cors());
app.use(express.json());

// ==============================
// API Routes
// ==============================

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/pricing", pricingRoutes);

// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "Photography Website API is running",
  });
});

// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});