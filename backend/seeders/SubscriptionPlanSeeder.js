const { default: mongoose } = require("mongoose");
const { connectDB, disconnectDB } = require("../database/database");
const SubscriptionPlan = require("../models/SubscriptionPlan");

const subscriptionPlans = [
  {
    _id: new mongoose.Types.ObjectId("66d58e237c3872bcb0a5aa28"),
    name: "Free",
    description: "Basic access to the platform with limited features.",
    price: 0,
    durationMonths: 1,
    features: [
      "Access to Free Workouts",
      "Basic Nutrition Tracking",
      "Free Community Support",
      "Limited Progress Reports",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("66d58e237c3872bcb0a5aa29"),
    name: "Basic",
    description: "Access to a wider range of workouts and additional features.",
    price: 1000,
    durationMonths: 1,
    features: [
      "Access to Basic Workouts",
      "Advanced Nutrition Tracking",
      "Monthly Progress Reports",
      "Basic Community Support",
      "Exercise History",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("66d58e237c3872bcb0a5aa2a"),
    name: "Premium",
    description:
      "All features included with personalized support and exclusive content.",
    price: 5000,
    durationMonths: 1,
    features: [
      "Personalized Workout Plans",
      "Access to All Workouts",
      "Premium Nutrition Tracking",
      "Weekly Progress Reports",
      "Premium Community Support",
      "Exercise History",
    ],
  },
];

connectDB();

SubscriptionPlan.insertMany(subscriptionPlans).then(() => {
  console.log("Subscription Plans Seed SuccessFully");
  disconnectDB();
});