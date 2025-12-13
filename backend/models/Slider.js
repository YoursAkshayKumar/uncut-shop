const mongoose = require("mongoose");

const sliderSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: "",
  },
  preTitle: {
    type: String,
    trim: true,
    default: "",
  },
  backgroundImage: {
    type: String,
    required: [true, "Please provide a background image"],
  },
  backgroundImageTablet: {
    type: String,
    default: "",
  },
  backgroundImageMobile: {
    type: String,
    default: "",
  },
  productImage: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    trim: true,
    default: "Explore The Collection",
  },
  buttonLink: {
    type: String,
    trim: true,
    default: "/shop",
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
}, {
  timestamps: true
});

const Slider = mongoose.model("Slider", sliderSchema);

module.exports = Slider;
