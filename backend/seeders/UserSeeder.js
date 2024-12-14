const User = require("../models/User");
const bcrypt = require("bcrypt");
const { connectDB, disconnectDB } = require("../database/database");
const { default: mongoose } = require("mongoose");

const users = [
  {
    _id: new mongoose.Types.ObjectId("60df6999e4b0c0c93408e2c1"),
    role: "60df6999e4b0c0c93408e2c4",
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    password: "Dev@2020!",
    date_of_birth: new Date(),
    gender: "Male",
    phone_number: 198372390,
    address: "jsdhjsd jksdg sdjkg sdjkgds",
    profile:
      "http://localhost:5000/uploads/1720616429572-42154486-option1-normal.png",
  },
];



connectDB();

Promise.all(
  users.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return {
      ...user,
      password: hashedPassword,
    };
  })
).then(async (hashedUser) => {
  try {
    await User.insertMany(hashedUser);
    console.log("SuccessFully Seeded Users!");
  } catch (err) {
    console.log(err);
  } finally {
    disconnectDB();
  }
});