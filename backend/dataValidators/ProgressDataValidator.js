const { body } = require("express-validator");

const ProgressDataValidator = [
  body("weight")
    .notEmpty()
    .withMessage("Weight field is required!")
    .isNumeric()
    .withMessage("Weight must be a number!"),
  body("body_measurements.chest")
    .notEmpty()
    .withMessage("Chest field is required!")
    .isNumeric()
    .withMessage("Chest measurement must be a number"),
  body("body_measurements.waist")
    .notEmpty()
    .withMessage("Waist field is required!")
    .isNumeric()
    .withMessage("Waist measurement must be a number"),
  body("body_measurements.hips")
    .notEmpty()
    .withMessage("Hips field is required!")
    .isNumeric()
    .withMessage("Hips measurement must be a number"),
  body("body_measurements.thighs")
    .notEmpty()
    .withMessage("Thigs field is required!")
    .isNumeric()
    .withMessage("Thighs measurement must be a number"),
  body("body_measurements.arms")
    .notEmpty()
    .withMessage("Arms field is required!")
    .isNumeric()
    .withMessage("Arms measurement must be a number"),
  body("performance_metrics.run_time")
    .notEmpty()
    .withMessage("Runtime field is required!")
    .isNumeric()
    .withMessage("Run time must be a number"),
  body("performance_metrics.lifting_weights")
    .notEmpty()
    .withMessage("Lifting weights field is required!")
    .isNumeric()
    .withMessage("Lifting weights must be a number"),
];

module.exports = ProgressDataValidator;