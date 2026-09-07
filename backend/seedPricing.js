require("dotenv").config();

const connectDB = require("./config/db");
const Pricing = require("./models/Pricing");

const packages = [
  {
    number: "01",
    name: "Essential",
    description:
      "Perfect for intimate sessions, portraits, and smaller celebrations.",
    price: 15000,
    features: [
      "2 Hours Coverage",
      "1 Photographer",
      "100+ Edited Photos",
      "Online Gallery",
      "7 Days Delivery",
    ],
    popular: false,
    active: true,
    order: 1,
  },

  {
    number: "02",
    name: "Signature",
    description:
      "Our most popular package for couples, pre-weddings, and special events.",
    price: 30000,
    features: [
      "5 Hours Coverage",
      "1 Photographer",
      "250+ Edited Photos",
      "Online Gallery",
      "Premium Editing",
      "5 Days Delivery",
    ],
    popular: true,
    active: true,
    order: 2,
  },

  {
    number: "03",
    name: "Complete",
    description:
      "Full-day photography coverage for weddings and large celebrations.",
    price: 50000,
    features: [
      "Full-Day Coverage",
      "2 Photographers",
      "500+ Edited Photos",
      "Online Gallery",
      "Premium Editing",
      "Photo Slideshow",
      "3 Days Delivery",
    ],
    popular: false,
    active: true,
    order: 3,
  },
];

const seedPricing = async () => {
  try {
    await connectDB();

    await Pricing.deleteMany({});

    await Pricing.insertMany(packages);

    console.log(
      "Pricing packages seeded successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Pricing seed error:",
      error
    );

    process.exit(1);
  }
};

seedPricing();