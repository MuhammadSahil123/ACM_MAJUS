const { default: mongoose } = require("mongoose");

const ContactSchema = new mongoose.Schema({
  ip: {
    type: String,
  },
  full_name: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
});

ContactSchema.set("timestamps", true);

module.exports = mongoose.model("Contact", ContactSchema);