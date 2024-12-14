const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workout_routine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutRoutine",
  },
  type: {
    type: String,
    enum: ["workout_completion", "goal_achievement"],
  },
  message: { type: String },
  read: { type: Boolean, default: false },
});

NotificationSchema.set("timestamps", true);

module.exports = mongoose.model("Notification", NotificationSchema);