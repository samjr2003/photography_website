const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");

// =========================================================
// CREATE PORTFOLIO ITEM
// =========================================================

const createPortfolio = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      featured,
      order,
    } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        message: "Title and category are required.",
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Portfolio image is required.",
      });
    }

    // Upload image to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "lens-studio/portfolio",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        stream.end(req.file.buffer);
      });
    };

    const uploadedImage =
      await uploadToCloudinary();

    // Save to MongoDB
    const portfolio =
      await Portfolio.create({
        title: title.trim(),

        category: category.trim(),

        image: uploadedImage.secure_url,

        cloudinaryPublicId:
          uploadedImage.public_id,

        description:
          description?.trim() || "",

        featured:
          featured === true ||
          featured === "true",

        order: Number(order) || 0,
      });

    res.status(201).json({
      message:
        "Portfolio item created successfully.",

      portfolio,
    });
  } catch (error) {
    console.error(
      "Create Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating portfolio item.",
    });
  }
};


// =========================================================
// GET ALL PORTFOLIO ITEMS
// =========================================================

const getPortfolio = async (req, res) => {
  try {
    const portfolio =
      await Portfolio.find().sort({
        order: 1,
        createdAt: -1,
      });

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    console.error(
      "Get Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching portfolio.",
    });
  }
};


// =========================================================
// GET FEATURED PORTFOLIO ITEMS
// =========================================================

const getFeaturedPortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await Portfolio.find({
        featured: true,
      }).sort({
        order: 1,
        createdAt: -1,
      });

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    console.error(
      "Get Featured Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching featured portfolio.",
    });
  }
};


// =========================================================
// GET SINGLE PORTFOLIO ITEM
// =========================================================

const getSinglePortfolio = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const portfolio =
      await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        message:
          "Portfolio item not found.",
      });
    }

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    console.error(
      "Get Single Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching portfolio item.",
    });
  }
};


// =========================================================
// UPDATE PORTFOLIO ITEM
// =========================================================

const updatePortfolio = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      description,
      featured,
      order,
    } = req.body;

    // Find existing portfolio item
    const portfolio =
      await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        message:
          "Portfolio item not found.",
      });
    }

    // -----------------------------------------
    // Update text fields
    // -----------------------------------------

    if (title !== undefined) {
      portfolio.title = title.trim();
    }

    if (category !== undefined) {
      portfolio.category =
        category.trim();
    }

    if (description !== undefined) {
      portfolio.description =
        description.trim();
    }

    if (featured !== undefined) {
      portfolio.featured =
        featured === true ||
        featured === "true";
    }

    if (order !== undefined) {
      portfolio.order =
        Number(order) || 0;
    }


    // -----------------------------------------
    // Replace image if new image uploaded
    // -----------------------------------------

    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise(
          (resolve, reject) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "lens-studio/portfolio",

                  resource_type: "image",
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );

            stream.end(req.file.buffer);
          }
        );
      };

      // Upload new image first
      const uploadedImage =
        await uploadToCloudinary();


      // Delete old Cloudinary image
      if (
        portfolio.cloudinaryPublicId
      ) {
        try {
          await cloudinary.uploader.destroy(
            portfolio.cloudinaryPublicId,
            {
              resource_type: "image",
            }
          );
        } catch (cloudinaryError) {
          console.error(
            "Old Cloudinary image delete error:",
            cloudinaryError
          );
        }
      }


      // Save new image information
      portfolio.image =
        uploadedImage.secure_url;

      portfolio.cloudinaryPublicId =
        uploadedImage.public_id;
    }


    // -----------------------------------------
    // Save changes
    // -----------------------------------------

    await portfolio.save();


    res.status(200).json({
      message:
        "Portfolio item updated successfully.",

      portfolio,
    });
  } catch (error) {
    console.error(
      "Update Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating portfolio item.",
    });
  }
};


// =========================================================
// DELETE PORTFOLIO ITEM
// =========================================================

const deletePortfolio = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // Find portfolio item
    const portfolio =
      await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        message:
          "Portfolio item not found.",
      });
    }


    // -----------------------------------------
    // Delete image from Cloudinary
    // -----------------------------------------

    if (
      portfolio.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          portfolio.cloudinaryPublicId,
          {
            resource_type: "image",
          }
        );

        console.log(
          "Cloudinary image deleted:",
          portfolio.cloudinaryPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary Delete Error:",
          cloudinaryError
        );
      }
    }


    // -----------------------------------------
    // Delete MongoDB document
    // -----------------------------------------

    await Portfolio.findByIdAndDelete(id);


    // -----------------------------------------
    // Response
    // -----------------------------------------

    res.status(200).json({
      message:
        "Portfolio item deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Portfolio Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting portfolio item.",
    });
  }
};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {
  createPortfolio,
  getPortfolio,
  getFeaturedPortfolio,
  getSinglePortfolio,
  updatePortfolio,
  deletePortfolio,
};