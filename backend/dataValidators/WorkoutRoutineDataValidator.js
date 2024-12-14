const { body } = require("express-validator");

const WorkoutRoutineDataValidator = [
  body("user").notEmpty().withMessage("User field is required"),
  body("category").notEmpty().withMessage("Category field is required"),
  body("routine_name").notEmpty().withMessage("Routine name field is required"),
  body("image").notEmpty().withMessage("Routine image field is required"),
  body("short_description")
    .notEmpty()
    .withMessage("Short description field is required"),
  body("exercises")
    .isArray({ min: 1 })
    .withMessage("Exercises should be an array"),
  body("exercises.*.exercise_name")
    .notEmpty()
    .withMessage("Exercise name field is required"),
  body("exercises.*.sets")
    .isInt({ min: 1 })
    .withMessage("Sets should be a positive integer"),
  body("exercises.*.reps")
    .isInt({ min: 1 })
    .withMessage("Reps should be a positive integer"),
  body("exercises.*.weight").notEmpty().withMessage("Weight are required"),
];

module.exports = WorkoutRoutineDataValidator;