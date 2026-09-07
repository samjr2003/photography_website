const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

// =========================================================
// CLOUDINARY UPLOAD
// =========================================================

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "lens-studio/services",
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

    stream.end(file.buffer);
  });
};


// =========================================================
// GET SERVICES
// =========================================================

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(
      "Get Services Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching services.",
    });
  }
};

//Get All Services for Admin

const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(
      "Get All Admin Services Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching services.",
    });
  }
};


// =========================================================
// CREATE SERVICE
// =========================================================

const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      order,
      active,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message:
          "Title and description are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "Service image is required.",
      });
    }

    const uploadedImage =
      await uploadToCloudinary(
        req.file
      );

    const service =
      await Service.create({
        title: title.trim(),

        description:
          description.trim(),

        price:
          Number(price) || 0,

        image:
          uploadedImage.secure_url,

        cloudinaryPublicId:
          uploadedImage.public_id,

        order:
          Number(order) || 0,

        active:
          active === undefined
            ? true
            : active === true ||
              active === "true",
      });

    res.status(201).json({
      message:
        "Service created successfully.",

      service,
    });
  } catch (error) {
    console.error(
      "Create Service Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating service.",
    });
  }
};


// =========================================================
// UPDATE SERVICE
// =========================================================

const updateService = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const service =
      await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message:
          "Service not found.",
      });
    }

    const {
      title,
      description,
      price,
      order,
      active,
    } = req.body;

    if (title !== undefined) {
      service.title =
        title.trim();
    }

    if (description !== undefined) {
      service.description =
        description.trim();
    }

    if (price !== undefined) {
      service.price =
        Number(price) || 0;
    }

    if (order !== undefined) {
      service.order =
        Number(order) || 0;
    }

    if (active !== undefined) {
      service.active =
        active === true ||
        active === "true";
    }


    // =====================================================
    // REPLACE IMAGE
    // =====================================================

    if (req.file) {
      const uploadedImage =
        await uploadToCloudinary(
          req.file
        );

      // Delete old image
      if (service.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(
            service.cloudinaryPublicId,
            {
              resource_type: "image",
            }
          );
        } catch (error) {
          console.error(
            "Old Service Image Delete Error:",
            error
          );
        }
      }

      // Save new image
      service.image =
        uploadedImage.secure_url;

      service.cloudinaryPublicId =
        uploadedImage.public_id;
    }


    await service.save();

    res.status(200).json({
      message:
        "Service updated successfully.",

      service,
    });
  } catch (error) {
    console.error(
      "Update Service Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating service.",
    });
  }
};


// =========================================================
// DELETE SERVICE
// =========================================================

const deleteService = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const service =
      await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message:
          "Service not found.",
      });
    }


    // =====================================================
    // DELETE CLOUDINARY IMAGE
    // =====================================================

    if (service.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(
          service.cloudinaryPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (error) {
        console.error(
          "Cloudinary Delete Error:",
          error
        );
      }
    }


    // =====================================================
    // DELETE MONGODB SERVICE
    // =====================================================

    await Service.findByIdAndDelete(
      id
    );


    res.status(200).json({
      message:
        "Service deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Service Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting service.",
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
};