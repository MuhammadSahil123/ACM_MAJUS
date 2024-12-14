const { default: mongoose } = require("mongoose");
const { connectDB, disconnectDB } = require("../database/database");
const Role = require("../models/Role")

const roles = [
  {
    _id: new mongoose.Types.ObjectId("60df6999e4b0c0c93408e2c4"),
    name: "Admin",
  },
  {
    _id: new mongoose.Types.ObjectId("60df6999e4b0c0c93408e2c5"),
    name: "User",
  },
];

connectDB();

Role.insertMany(roles).then(() => {
  console.log("Role Seed SuccessFully");
  disconnectDB();
});