const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
    name: { type: String },
    quantity: { type: Number },
    unit: { type: String, default: "g" },
    calories: { type: Number },
    macros: {
        carbs: { type: Number },
        protein: { type: Number },
        fat: { type: Number },
    },
});

const NutritionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    meal_type: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    },
    food_items: [FoodItemSchema],
    total_calories: { type: Number },
    total_macros: {
        carbs: { type: Number },
        protein: { type: Number },
        fat: { type: Number },
    },
    water_intake: { type: Number, default: 0 },
    plan_type: {
        type: String,
        enum: ["Free", "Basic", "Premium"],
    },
});

NutritionSchema.set("timestamps", true);

module.exports = mongoose.model("Nutrition", NutritionSchema);