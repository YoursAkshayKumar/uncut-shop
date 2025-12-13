const mongoose = require("mongoose");
const validator = require("validator");

const subscriptionSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please provide a valid email"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "unsubscribed"],
    default: "active",
  },
}, {
  timestamps: true
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
