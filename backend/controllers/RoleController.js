const { validationResult } = require("express-validator");
const Role = require("../models/Role");

const getRolesList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let roles;
    let pagination;
    const totalRoles = await Role.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      roles = await Role.find().sort({ _id: -1 }).skip(startIndex).limit(limit);
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalRoles,
      };
    } else {
      roles = await Role.find().sort({ _id: -1 });
    }

    if (name && name != "") {
      roles = await Role.find({
        name: new RegExp(`^${name}`, "i"),
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Roles!",
      roles: roles,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addRole = async (req, res) => {
  try {
    const { name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const role = await Role.findOne({ name: name });

    if (role) {
      res.status(400).json({
        message: "Role Already Exist!",
      });
    } else {
      const newRole = Role({
        name: name,
      });

      const newRoleSave = await newRole.save();

      res.status(200).json({
        message: "SuccessFully Created Role!",
        role: newRoleSave,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const editRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      res.status(400).json({ message: "Role Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      role.name = name;

      const updateRoleSave = await role.save();

      res.status(200).json({
        message: "SuccessFully Updated Role!",
        role: updateRoleSave,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteRole = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      res.status(400).json({ message: "Role Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Role!",
      role: role,
    });
  } catch (err) {
    console.log(err);
  }
};

const singleRole = async (req, res) => {
  try {
    const name = req.query.name;
    const id = req.query.id;

    let role;

    if (name && name != "") {
      role = await Role.findOne({ name: name });
    }

    if (id && id != "") {
      role = await Role.findById(id);
    }

    if (!role) {
      res.status(200).json({ message: "Role Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Role!",
      role: role,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getRolesList, addRole, editRole, deleteRole, singleRole };