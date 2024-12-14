const { body } = require("express-validator");

const RoleDataValidator = [
  body("name").notEmpty().withMessage("Name field is required!"),
];

module.exports = RoleDataValidator;