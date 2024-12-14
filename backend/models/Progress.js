const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
  weight: {
    type: Number,
    required: true,
  },
  body_measurements: {
    chest: {
      type: Number,
      required: true,
    },
    waist: {
      type: Number,
      required: true,
    },
    hips: {
      type: Number,
      required: true,
    },
    thighs: {
      type: Number,
      required: true,
    },
    arms: {
      type: Number,
      required: true,
    },
  },
  performance_metrics: {
    run_time: {
      type: Number,
      required: true,
    },
    lifting_weights: {
      type: Number,
      required: true,
    },
  },
});

progressSchema.set("timestamps", true);

module.exports = mongoose.model("Progress", progressSchema);