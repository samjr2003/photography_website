const Pricing = require("../models/Pricing");

// =========================================================
// GET ACTIVE PRICING PACKAGES
// =========================================================

const getPricing = async (req, res) => {
  try {
    const packages = await Pricing.find({
      active: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      packages,
    });
  } catch (error) {
    console.error(
      "Get Pricing Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching pricing packages.",
    });
  }
};


// =========================================================
// GET ALL PRICING PACKAGES - ADMIN
// =========================================================

const getAllPricing = async (req, res) => {
  try {
    const packages = await Pricing.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      packages,
    });
  } catch (error) {
    console.error(
      "Get All Pricing Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching pricing packages.",
    });
  }
};


// =========================================================
// CREATE PRICING PACKAGE
// =========================================================

const createPricing = async (req, res) => {
  try {
    const {
      number,
      name,
      description,
      price,
      features,
      popular,
      active,
      order,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message:
          "Package name and description are required.",
      });
    }

    let parsedFeatures = [];

    if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (typeof features === "string") {
      try {
        parsedFeatures =
          JSON.parse(features);

        if (!Array.isArray(parsedFeatures)) {
          parsedFeatures = [
            features.trim(),
          ];
        }
      } catch {
        parsedFeatures = features
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean);
      }
    }

    const pricing = await Pricing.create({
      number:
        number?.trim() ||
        "01",

      name: name.trim(),

      description:
        description.trim(),

      price:
        Number(price) || 0,

      features:
        parsedFeatures,

      popular:
        popular === true ||
        popular === "true",

      active:
        active === undefined
          ? true
          : active === true ||
            active === "true",

      order:
        Number(order) || 0,
    });

    res.status(201).json({
      message:
        "Pricing package created successfully.",

      pricing,
    });
  } catch (error) {
    console.error(
      "Create Pricing Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating pricing package.",
    });
  }
};


// =========================================================
// UPDATE PRICING PACKAGE
// =========================================================

const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const pricing =
      await Pricing.findById(id);

    if (!pricing) {
      return res.status(404).json({
        message:
          "Pricing package not found.",
      });
    }

    const {
      number,
      name,
      description,
      price,
      features,
      popular,
      active,
      order,
    } = req.body;


    if (number !== undefined) {
      pricing.number =
        number.trim();
    }


    if (name !== undefined) {
      pricing.name =
        name.trim();
    }


    if (description !== undefined) {
      pricing.description =
        description.trim();
    }


    if (price !== undefined) {
      pricing.price =
        Number(price) || 0;
    }


    if (features !== undefined) {
      let parsedFeatures = [];

      if (Array.isArray(features)) {
        parsedFeatures =
          features;
      } else if (
        typeof features === "string"
      ) {
        try {
          parsedFeatures =
            JSON.parse(features);

          if (
            !Array.isArray(
              parsedFeatures
            )
          ) {
            parsedFeatures =
              features
                .split("\n")
                .map(
                  (feature) =>
                    feature.trim()
                )
                .filter(Boolean);
          }
        } catch {
          parsedFeatures =
            features
              .split("\n")
              .map(
                (feature) =>
                  feature.trim()
              )
              .filter(Boolean);
        }
      }

      pricing.features =
        parsedFeatures;
    }


    if (popular !== undefined) {
      pricing.popular =
        popular === true ||
        popular === "true";
    }


    if (active !== undefined) {
      pricing.active =
        active === true ||
        active === "true";
    }


    if (order !== undefined) {
      pricing.order =
        Number(order) || 0;
    }


    await pricing.save();


    res.status(200).json({
      message:
        "Pricing package updated successfully.",

      pricing,
    });
  } catch (error) {
    console.error(
      "Update Pricing Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating pricing package.",
    });
  }
};


// =========================================================
// DELETE PRICING PACKAGE
// =========================================================

const deletePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const pricing =
      await Pricing.findById(id);

    if (!pricing) {
      return res.status(404).json({
        message:
          "Pricing package not found.",
      });
    }

    await Pricing.findByIdAndDelete(id);

    res.status(200).json({
      message:
        "Pricing package deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Pricing Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting pricing package.",
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  getPricing,
  getAllPricing,
  createPricing,
  updatePricing,
  deletePricing,
};