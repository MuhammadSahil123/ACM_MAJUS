const { validationResult } = require("express-validator");
const WorkoutCategory = require("../models/WorkoutCategory");

const getWorkoutCategoriesList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let workoutCategories;
    let pagination;
    const totalWorkoutCategories = await WorkoutCategory.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      workoutCategories = await WorkoutCategory.find()
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit);
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalWorkoutCategories,
      };
    } else {
      workoutCategories = await WorkoutCategory.find().sort({ _id: -1 });
    }

    if (name && name != "") {
      workoutCategories = await WorkoutCategory.find({
        name: new RegExp(`^${name}`, "i"),
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Workout Categories!",
      workout_categories: workoutCategories,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addWorkoutCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const workoutCategory = await WorkoutCategory.findOne({ name: name });

    if (workoutCategory) {
      res.status(400).json({
        message: "Workout Category Already Exist!",
      });
    } else {
      const newWorkoutCategory = WorkoutCategory({
        name: name,
      });

      const newWorkoutCategorySave = await newWorkoutCategory.save();

      res.status(200).json({
        message: "SuccessFully Created Workout Category!",
        workout_category: newWorkoutCategorySave,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const editWorkoutCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const workoutCategory = await WorkoutCategory.findById(id);

    if (!workoutCategory) {
      res.status(400).json({ message: "Workout Category Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      workoutCategory.name = name;

      const updateWorkoutCategory = await workoutCategory.save();

      res.status(200).json({
        message: "SuccessFully Updated Workout Category!",
        workoutCategory: updateWorkoutCategory,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteWorkoutCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const workoutCategory = await WorkoutCategory.findByIdAndDelete(id);

    if (!workoutCategory) {
      res.status(400).json({ message: "Workout Category Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Workout Category!",
      workoutCategory: workoutCategory,
    });
  } catch (err) {
    console.log(err);
  }
};

const singleWorkoutCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const workoutCategory = await WorkoutCategory.findById(id);

    if (!workoutCategory) {
      res.status(400).json({ message: "Workout Category Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Workout Category!",
      workoutCategory: workoutCategory,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getWorkoutCategoriesList,
  addWorkoutCategory,
  editWorkoutCategory,
  deleteWorkoutCategory,
  singleWorkoutCategory,
};