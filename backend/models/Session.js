const { default: mongoose } = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ipAddress: String,
  deviceInfo: String,
  loginTime: { type: Date, default: Date.now },
  token: String,
});

module.exports = mongoose.model("Session", sessionSchema);