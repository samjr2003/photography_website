const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Wedding",
                "Pre-Wedding",
                "Portrait",
                "Event",
                "Maternity",
                "Fashion",
                "Other",
            ],
        },

        image: {
            type: String,
            required: true,
            trim: true,
        },

        cloudinaryPublicId: {
            type: String,
            default: "",
        },


        description: {
            type: String,
            trim: true,
            default: "",
        },

        featured: {
            type: Boolean,
            default: false,
        },

        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Portfolio",
    portfolioSchema
);