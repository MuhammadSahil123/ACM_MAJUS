const { body } = require("express-validator");

const NotificationDataValidator = [
  body("recipient").notEmpty().withMessage("Recipient field is required!"),
  body("sender").notEmpty().withMessage("Sender field is required!"),
  body("workout_routine")
    .notEmpty()
    .withMessage("Workout Routine field is required!"),
  body("type")
    .isIn([
      "workout_completion",
      "goal_achievement",
      "new_follower",
      "forum_response",
    ])
    .withMessage("Invalid type"),
  body("message").notEmpty().withMessage("Message field is required!"),
];

module.exports = NotificationDataValidator;