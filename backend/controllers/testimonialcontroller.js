const Testimonial = require("../models/Testimonial");

// =========================================================
// GET ACTIVE TESTIMONIALS
// =========================================================

const getTestimonials = async (req, res) => {
  try {
    const testimonials =
      await Testimonial.find({
        active: true,
      }).sort({
        order: 1,
        createdAt: -1,
      });

    res.status(200).json({
      testimonials,
    });
  } catch (error) {
    console.error(
      "Get Testimonials Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching testimonials.",
    });
  }
};


// =========================================================
// GET ALL TESTIMONIALS - ADMIN
// =========================================================

const getAllTestimonials = async (
  req,
  res
) => {
  try {
    const testimonials =
      await Testimonial.find().sort({
        order: 1,
        createdAt: -1,
      });

    res.status(200).json({
      testimonials,
    });
  } catch (error) {
    console.error(
      "Get All Testimonials Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching testimonials.",
    });
  }
};


// =========================================================
// CREATE
// =========================================================

const createTestimonial = async (
  req,
  res
) => {
  try {
    const {
      quote,
      name,
      event,
      location,
      featured,
      active,
      order,
    } = req.body;

    if (!quote || !name || !event) {
      return res.status(400).json({
        message:
          "Quote, name and event are required.",
      });
    }

    const testimonial =
      await Testimonial.create({
        quote: quote.trim(),

        name: name.trim(),

        event: event.trim(),

        location:
          location?.trim() || "",

        featured:
          featured === true ||
          featured === "true",

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
        "Testimonial created successfully.",

      testimonial,
    });
  } catch (error) {
    console.error(
      "Create Testimonial Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating testimonial.",
    });
  }
};


// =========================================================
// UPDATE
// =========================================================

const updateTestimonial = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const testimonial =
      await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        message:
          "Testimonial not found.",
      });
    }

    const {
      quote,
      name,
      event,
      location,
      featured,
      active,
      order,
    } = req.body;

    if (quote !== undefined) {
      testimonial.quote =
        quote.trim();
    }

    if (name !== undefined) {
      testimonial.name =
        name.trim();
    }

    if (event !== undefined) {
      testimonial.event =
        event.trim();
    }

    if (location !== undefined) {
      testimonial.location =
        location.trim();
    }

    if (featured !== undefined) {
      testimonial.featured =
        featured === true ||
        featured === "true";
    }

    if (active !== undefined) {
      testimonial.active =
        active === true ||
        active === "true";
    }

    if (order !== undefined) {
      testimonial.order =
        Number(order) || 0;
    }

    await testimonial.save();

    res.status(200).json({
      message:
        "Testimonial updated successfully.",

      testimonial,
    });
  } catch (error) {
    console.error(
      "Update Testimonial Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating testimonial.",
    });
  }
};


// =========================================================
// DELETE
// =========================================================

const deleteTestimonial = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const testimonial =
      await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        message:
          "Testimonial not found.",
      });
    }

    await Testimonial.findByIdAndDelete(
      id
    );

    res.status(200).json({
      message:
        "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Testimonial Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting testimonial.",
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};