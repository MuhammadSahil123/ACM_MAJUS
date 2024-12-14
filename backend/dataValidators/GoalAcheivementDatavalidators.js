const { body } = require("express-validator");

const GoalAchievementDataValidator = [
  body("user").notEmpty().withMessage("User field is required!"),
  body("type")
    .isIn(["workout_frequency", "total_weight_lifted"])
    .withMessage("Invalid type"),
  body("target").notEmpty().withMessage("Target field is required!"),
  body("description").notEmpty().withMessage("Description field is required!"),
];

module.exports = GoalAchievementDataValidator;