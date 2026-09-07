const express = require("express");

const router = express.Router();

const {
  getPortfolio,
  getFeaturedPortfolio,
  getSinglePortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// PUBLIC
router.get("/", getPortfolio);

router.get(
  "/featured",
  getFeaturedPortfolio
);

router.get(
  "/:id",
  getSinglePortfolio
);

// ADMIN - CREATE
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createPortfolio
);

// ADMIN - UPDATE
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updatePortfolio
);

// ADMIN - DELETE
router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePortfolio
);

module.exports = router;