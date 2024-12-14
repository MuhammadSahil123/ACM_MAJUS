const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["workout_frequency", "total_weight_lifted"],
  },
  target: {
    type: Number,
  },
  description: {
    type: String,
  },
  achieved: {
    type: Boolean,
    default: false,
  },
});

GoalSchema.set("timestamps", true);

module.exports = mongoose.model("Goal", GoalSchema);