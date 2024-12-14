const { default: mongoose } = require("mongoose");

const WorkoutCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

WorkoutCategorySchema.set("timestamps", true);

module.exports = mongoose.model("WorkoutCategory", WorkoutCategorySchema);