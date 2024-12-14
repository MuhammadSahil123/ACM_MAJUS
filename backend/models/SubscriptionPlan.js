const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  durationMonths: {
    type: Number,
  },
  features: {
    type: [String],
  },
});

SubscriptionPlanSchema.set("timestamps", true);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);