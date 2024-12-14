const { default: mongoose } = require("mongoose");
const { connectDB, disconnectDB } = require("../database/database");
const WorkoutCategory = require("../models/WorkoutCategory");

const workoutCategories = [
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c246c"),
    name: "Strength",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c247c"),
    name: "Cardio",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c248c"),
    name: "Endurance",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c249c"),
    name: "Balance",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c250c"),
    name: "Flexibility",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c251c"),
    name: "Full Body",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c252c"),
    name: "Increase Strength",
  },
  {
    _id: new mongoose.Types.ObjectId("668ee7fb9514664ecd3c253c"),
    name: "Stretching",
  },
];

connectDB();

WorkoutCategory.insertMany(workoutCategories).then(() => {
  console.log("Workout Category Seed SuccessFully");
  disconnectDB();
});