const { body } = require("express-validator");
const User = require("../models/User");

const CreateUserDataValidator = [
  body("role").notEmpty().withMessage("Role field is required!"),
  body("first_name").notEmpty().withMessage("First name field is required!"),
  body("last_name").notEmpty().withMessage("Last name field is required!"),
  body("email")
    .notEmpty()
    .withMessage("Email field is required!")
    .isEmail()
    .withMessage("Valid Email Address"),
  body("password")
    .notEmpty()
    .withMessage("Password field is required!")
    .isLength(4)
    .withMessage("Password is greater than 4!"),
  body("date_of_birth")
    .notEmpty()
    .withMessage("Date of Birth field is required!"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender field is invalid!"),
  body("phone_number")
    .notEmpty()
    .withMessage("Phone number field is required!"),
  body("address").notEmpty().withMessage("Address field is required!"),
  body("profile").notEmpty().withMessage("Profile field is required!"),
];

const UpdateUserDataValidator = [
  body("role").notEmpty().withMessage("Role field is required!"),
  body("first_name").notEmpty().withMessage("First name field is required!"),
  body("last_name").notEmpty().withMessage("Last name field is required!"),
  body("email")
    .notEmpty()
    .withMessage("Email field is required!")
    .isEmail()
    .withMessage("Valid Email Address"),
  body("date_of_birth")
    .notEmpty()
    .withMessage("Date of Birth field is required!"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender field is invalid!"),
  body("phone_number")
    .notEmpty()
    .withMessage("Phone number field is required!"),
  body("address").notEmpty().withMessage("Address field is required!"),
  body("profile").notEmpty().withMessage("Profile field is required!"),
];

module.exports = { CreateUserDataValidator, UpdateUserDataValidator };