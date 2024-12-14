const { body } = require("express-validator");

const NutritionDataValidator = [
  body("meal_type")
    .isIn(["Breakfast", "Lunch", "Dinner", "Snack"])
    .withMessage("Invalid meal type"),
  body("food_items")
    .isArray({ min: 1 })
    .withMessage("Food items must be an array with at least one item"),
  body("food_items.*.name")
    .notEmpty()
    .withMessage("Food item name is required"),
  body("food_items.*.quantity")
    .notEmpty()
    .withMessage("Food item quantity is required"),
  body("food_items.*.calories")
    .isNumeric()
    .withMessage("Food item calories must be a number"),
  body("food_items.*.macros.carbs")
    .isNumeric()
    .withMessage("Carbs must be a number"),
  body("food_items.*.macros.protein")
    .isNumeric()
    .withMessage("Protein must be a number"),
  body("food_items.*.macros.fat")
    .isNumeric()
    .withMessage("Fat must be a number"),
];

module.exports = NutritionDataValidator;