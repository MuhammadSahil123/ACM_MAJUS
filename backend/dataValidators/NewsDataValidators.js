const { body } = require("express-validator");

const NewsDataValidator = [
  body("user").notEmpty().withMessage("User field is required!"),
  body("title").notEmpty().withMessage("Title field is required!"),
  body("content").notEmpty().withMessage("Content field is required!"),
  body("image").notEmpty().withMessage("Image field is required!"),
];

module.exports = NewsDataValidator;