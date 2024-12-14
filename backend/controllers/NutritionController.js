const { validationResult } = require("express-validator");
const Nutrition = require("../models/Nutrition");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const fs = require("fs");
const os = require("os");

const getFoodsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const first_food_name = req.query.first_food_name;
    const meal_type = req.query.meal_type;
    const user_id = req.query.user_id;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let query = {};
    if (user_id && user_id !== "") {
      query.user = user_id;
    }
    if (meal_type && meal_type !== "") {
      query.meal_type = { $regex: meal_type, $options: "i" }; // case-insensitive regex
    }

    if (first_food_name && first_food_name !== "") {
      query["food_items.name"] = { $regex: first_food_name, $options: "i" };
    }

    let foods;
    let pagination;
    const totalFoods = await Nutrition.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      foods = await Nutrition.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "user",
        });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalFoods,
      };
    } else {
      foods = await Nutrition.find().sort({ _id: -1 }).populate({
        path: "user",
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Foods!",
      foods: foods,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const foodDataExportToCsv = async (req, res) => {
  try {
    const first_food_name = req.query.first_food_name;
    const meal_type = req.query.meal_type;

    let query = {};

    if (meal_type && meal_type !== "") {
      query.meal_type = { $regex: meal_type, $options: "i" }; // case-insensitive regex
    }

    if (first_food_name && first_food_name !== "") {
      query["food_items.name"] = { $regex: first_food_name, $options: "i" };
    }

    const foods = await Nutrition.find(query).exec();

    const filePath = path.join(os.homedir(), "Downloads", "nutrition_data.csv");

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: "_id", title: "ID" },
        { id: "user", title: "User ID" },
        { id: "meal_type", title: "Meal Type" },
        { id: "food_name", title: "Food Name" },
        { id: "food_quantity", title: "Quantity" },
        { id: "food_calories", title: "Calories" },
        { id: "carbs", title: "Carbs" },
        { id: "protein", title: "Protein" },
        { id: "fat", title: "Fat" },
        { id: "date", title: "Date" },
        { id: "createdAt", title: "Created At" },
        { id: "updatedAt", title: "Updated At" },
      ],
    });

    const records = foods
      .map((item) => {
        return item.food_items.map((food) => ({
          _id: item._id.toString(),
          user: item.user.toString(),
          meal_type: item.meal_type,
          food_name: food.name,
          food_quantity: food.quantity,
          food_calories: food.calories,
          carbs: food.macros.carbs,
          protein: food.macros.protein,
          fat: food.macros.fat,
          date: item.date.toISOString(),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        }));
      })
      .flat();

    await csvWriter.writeRecords(records);

    res.download(filePath, "nutrition_data.csv", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file.");
      } else {
        console.log("File download triggered.");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred.");
  }
};
const getRecentFoodsList = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const limit = req.query.limit;

    const foods = await Nutrition.find({ user: user_id })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      message: "SuccessFully Finded Recent Foods!",
      foods: foods,
    });
  } catch (err) {
    console.log(err);
  }
};

const getFoodsAnalytics = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const objectId = new mongoose.Types.ObjectId(user_id);

    const calorieIntake = await Nutrition.aggregate([
      { $match: { user: objectId } },
      { $unwind: "$food_items" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: "$food_items.calories" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const macronutrientDistribution = await Nutrition.aggregate([
      { $match: { user: objectId } },
      { $unwind: "$food_items" },
      {
        $group: {
          _id: null,
          totalCarbs: { $sum: "$food_items.macros.carbs" },
          totalProtein: { $sum: "$food_items.macros.protein" },
          totalFat: { $sum: "$food_items.macros.fat" },
        },
      },
    ]);

    res.status(200).json({
      message: "Successfully found food analytics!",
      calorie_intake: calorieIntake,
      macronutrient_distribution: macronutrientDistribution[0],
    });
  } catch (err) {
    console.log(err);
  }
};

const addFood = async (req, res) => {
  try {
    const { user, food_items } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authUser = await User.findById(user)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (isPlanExpired) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;

    food_items.forEach((item) => {
      totalCalories += parseFloat(item?.calories) || 0;
      totalCarbs += parseFloat(item?.macros?.carbs) || 0;
      totalProtein += parseFloat(item?.macros?.protein) || 0;
      totalFat += parseFloat(item?.macros?.fat) || 0;
    });

    if (authUser?.currentPlan?.name === "Free") {
      const { meal_type, food_items } = req.body;
      const food = new Nutrition({
        user: user,
        meal_type: meal_type,
        total_macros: {
          carbs: totalCarbs,
          protein: totalProtein,
          fat: totalFat,
        },
        total_calories: totalCalories,
        food_items: food_items,
        plan_type: authUser?.currentPlan?.name,
      });

      await food.save();
      res.status(200).json({
        message: "SuccessFully Add Nutrition!",
        food: food,
      });
    } else {
      const { food_items, water_intake, meal_type } = req.body;

      const food = new Nutrition({
        user: user,
        food_items: food_items,
        total_calories: totalCalories,
        total_macros: {
          carbs: totalCarbs,
          protein: totalProtein,
          fat: totalFat,
        },
        water_intake: water_intake,
        meal_type: meal_type,
        plan_type: authUser?.currentPlan?.name,
      });

      await food.save();
      res.status(200).json({
        message: "SuccessFully Add Nutrition!",
        food: food,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateFood = async (req, res) => {
  try {
    const id = req.params.id;
    const { user, food_items } = req.body;

    const authUser = await User.findById(user)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (isPlanExpired) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    const food = await Nutrition.findById(id);

    if (!food) {
      res.status(400).json({ message: "Food Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let totalCalories = 0;
      let totalCarbs = 0;
      let totalProtein = 0;
      let totalFat = 0;

      food_items.forEach((item) => {
        totalCalories += parseFloat(item?.calories) || 0;
        totalCarbs += parseFloat(item?.macros?.carbs) || 0;
        totalProtein += parseFloat(item?.macros?.protein) || 0;
        totalFat += parseFloat(item?.macros?.fat) || 0;
      });

      if (authUser?.currentPlan?.name === "Free") {
        const { meal_type, food_items } = req.body;
        food.user = user;
        food.meal_type = meal_type;
        food.total_macros = {
          carbs: totalCarbs,
          protein: totalProtein,
          fat: totalFat,
        };
        food.total_calories = totalCalories;
        food.food_items = food_items;
        food.plan_type = authUser?.currentPlan?.name;
      } else {
        const { food_items, water_intake, meal_type } = req.body;
        food.user = user;
        food.meal_type = meal_type;
        food.total_macros = {
          carbs: totalCarbs,
          protein: totalProtein,
          fat: totalFat,
        };
        food.water_intake = water_intake;
        food.total_calories = totalCalories;
        food.food_items = food_items;
        food.plan_type = authUser?.currentPlan?.name;
      }

      const updateFood = await food.save();

      res.status(200).json({
        message: "SuccessFully Update Nutrition!",
        food: updateFood,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteFood = async (req, res) => {
  try {
    const id = req.params.id;

    const food = await Nutrition.findById(id);

    if (!food) {
      res.status(200).json({ message: "Food Not Found!" });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (isPlanExpired) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    await Nutrition.findByIdAndDelete(id);

    res.status(200).json({
      message: "SuccessFully Deleted Nutrition!",
      food: food,
    });
  } catch (err) {
    console.log(err);
  }
};

const singleFood = async (req, res) => {
  try {
    const id = req.params.id;

    const food = await Nutrition.findById(id).populate({
      path: "user",
    });

    if (!food) {
      res.status(200).json({ message: "Nutrition Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Nutrition!",
      food: food,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getFoodsList,
  foodDataExportToCsv,
  getRecentFoodsList,
  getFoodsAnalytics,
  addFood,
  updateFood,
  deleteFood,
  singleFood,
};