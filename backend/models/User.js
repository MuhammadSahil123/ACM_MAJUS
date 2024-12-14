const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  currentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
  },
  planExpiryDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  stripeSessionId: {
    type: String,
    default: "",
  },
  hasUsedFreePlan: { type: Boolean, default: false },
});

UserSchema.set("timestamps", true);

module.exports = mongoose.model("User", UserSchema);