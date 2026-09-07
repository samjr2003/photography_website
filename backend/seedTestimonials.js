const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const Testimonial = require("./models/Testimonial");

const testimonials = [
  {
    quote:
      "Every photograph felt incredibly natural and emotional. We didn't just receive beautiful pictures — we received memories we can relive forever.",
    name: "Arun & Priya",
    event: "Wedding Photography",
    location: "Chennai",
    featured: true,
    active: true,
    order: 1,
  },

  {
    quote:
      "The entire experience was comfortable from beginning to end. The photographs captured our personalities perfectly.",
    name: "Rahul & Meera",
    event: "Pre-Wedding Photography",
    location: "Coimbatore",
    featured: false,
    active: true,
    order: 2,
  },

  {
    quote:
      "The attention to detail was amazing. Every little moment from our celebration was beautifully documented.",
    name: "Karthik & Ananya",
    event: "Engagement Photography",
    location: "Madurai",
    featured: false,
    active: true,
    order: 3,
  },

  {
    quote:
      "I loved how relaxed the portrait session felt. The final photographs looked authentic and exactly like me.",
    name: "Nisha",
    event: "Portrait Photography",
    location: "Bangalore",
    featured: false,
    active: true,
    order: 4,
  },

  {
    quote:
      "From the planning to the final gallery, everything was handled professionally. We couldn't have asked for a better experience.",
    name: "Vijay & Divya",
    event: "Wedding Photography",
    location: "Chennai",
    featured: false,
    active: true,
    order: 5,
  },

  {
    quote:
      "The team knew exactly when to step back and capture genuine moments. Looking through the gallery brought back so many emotions.",
    name: "Sanjay & Kavya",
    event: "Wedding Photography",
    location: "Coimbatore",
    featured: false,
    active: true,
    order: 6,
  },
];

const seedTestimonials = async () => {
  try {
    await connectDB();

    await Testimonial.deleteMany();

    await Testimonial.insertMany(
      testimonials
    );

    console.log(
      "Testimonials seeded successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Testimonials seed error:",
      error
    );

    process.exit(1);
  }
};

seedTestimonials();