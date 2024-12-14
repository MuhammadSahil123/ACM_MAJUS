const { body } = require("express-validator");

const AuthenticationDataValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email field is required!")
    .isEmail()
    .withMessage("Valid Email Address!"),
  body("password")
    .notEmpty()
    .withMessage("Password field is required!")
    .isLength(4)
    .withMessage("Password Greater Than 4!")
];

module.exports = AuthenticationDataValidator;