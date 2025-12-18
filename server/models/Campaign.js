const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: [
      "Medical",
      "Education",
      "Environment",
      "Animal Welfare",
      "Disaster Relief",
      "Others",
    ],
  },
  goalAmount: {
    type: Number,
    required: [true, "Please add a goal amount"],
    min: [1, "Goal amount must be at least 1"],
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  endDate: {
    type: Date,
    required: [true, "Please add an end date"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "expired"],
    default: "active",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/400x300?text=Campaign",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate progress percentage
CampaignSchema.virtual("progressPercentage").get(function () {
  return Math.min(
    Math.round((this.currentAmount / this.goalAmount) * 100),
    100
  );
});

// Calculate days remaining
CampaignSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Enable virtuals in JSON
CampaignSchema.set("toJSON", { virtuals: true });
CampaignSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Campaign", CampaignSchema);
