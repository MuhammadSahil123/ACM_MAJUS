const { body } = require("express-validator");

const ContactDataValidator = [
  body("full_name").notEmpty().withMessage("Full name field is required!"),
  body("message").notEmpty().withMessage("Message field is required!"),
];

module.exports = ContactDataValidator;