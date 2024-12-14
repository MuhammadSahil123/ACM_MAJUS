const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  exercise_name: { type: String },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: String },
  rest_time: {
    type: String,
    default: "60 seconds",
  },
  notes: { type: String, default: "" },
});

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
});

CommentSchema.set("timestamps", true);

const WorkoutRoutineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutCategory",
  },
  routine_name: { type: String, trim: true },
  force: { type: String, enum: ["Pull", "Push", "Static"] },
  image: { type: String },
  short_description: { type: String, maxLength: 200 },
  exercises: [ExerciseSchema],
  duration: {
    type: String,
    default: "30 minutes",
  },
  difficulty_level: {
    type: String,
    enum: ["Easy", "Beginner", "Intermediate", "Hard"],
    default: "Intermediate",
  },
  plan_access: {
    type: String,
    enum: ["Free", "Basic", "Premium"],
    default: "Free",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  access: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public",
  },
  instructions: [String],
  comments: [CommentSchema],
});

WorkoutRoutineSchema.set("timestamps", true);

module.exports = mongoose.model("WorkoutRoutine", WorkoutRoutineSchema);