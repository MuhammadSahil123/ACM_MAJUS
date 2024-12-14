const { body } = require("express-validator");

const WorkoutCategoryDataValidator = [
  body("name").notEmpty().withMessage("Name field is required!"),
];

module.exports = WorkoutCategoryDataValidator;