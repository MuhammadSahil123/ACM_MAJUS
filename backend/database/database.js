const mongoose = require("mongoose");

const mongoURI = "";

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("SuccessFully Database Connected!");
  } catch (error) {
    console.error(error.message);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected Database");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};