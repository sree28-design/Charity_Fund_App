const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Please add a donation amount"],
    min: [1, "Amount must be at least 1"],
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    maxlength: [500, "Message cannot be more than 500 characters"],
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Donation", DonationSchema);
