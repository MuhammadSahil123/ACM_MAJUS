const { validationResult } = require("express-validator");
const GoalAchievement = require("../models/GoalAchievement");

const getGoalAchievementList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const user_id = req.query.user_id;
    const type = req.query.type;
    const achieved = req.query.achieved;
    const not_achieved = req.query.not_achieved;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let query = {};
    if (user_id && user_id !== "") {
      query.user = user_id;
    }

    if (type && type !== "") {
      query.type = type;
    }

    if (achieved) {
      query.achieved = achieved;
    }

    if (not_achieved) {
      query.achieved = not_achieved;
    }

    let goalAchievements;
    let pagination;
    const totalGoalAchievements = await GoalAchievement.countDocuments(query);

    if (paginationStatus && paginationStatus == 1) {
      goalAchievements = await GoalAchievement.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "user",
        });

      pagination = {
        current_page: page,
        per_page: limit,
        total: totalGoalAchievements,
      };
    } else {
      goalAchievements = await GoalAchievement.find(query)
        .sort({ _id: -1 })
        .populate({
          path: "user",
        });
    }

    res.status(200).json({
      message: "Successfully Found Goal Achievements!",
      goal_achievements: goalAchievements,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addGoalAchievement = async (req, res) => {
  try {
    const { user, type, target, description, achieved } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goalAchievement = new GoalAchievement({
      user: user,
      type: type,
      target: target,
      description: description,
      achieved: achieved,
    });

    const newGoalAchievement = await goalAchievement.save();

    res.status(200).json({
      message: "SuccessFully Add Goal Achievement!",
      goalAchievement: newGoalAchievement,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoalAchievement = async (req, res) => {
  try {
    const id = req.params.id;

    const { user, type, target, description, achieved } = req.body;

    const goalAchievement = await GoalAchievement.findById(id);

    if (!goalAchievement) {
      res.status(400).json({ message: "Goal Achievement Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      goalAchievement.user = user;
      goalAchievement.type = type;
      goalAchievement.target = target;
      goalAchievement.description = description;
      goalAchievement.achieved = achieved;

      const updateGoalAchievement = await goalAchievement.save();

      res.status(200).json({
        message: "SuccessFully Updated Goal Achievement!",
        goalAchievement: updateGoalAchievement,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteGoalAchievement = async (req, res) => {
  try {
    const id = req.params.id;

    const goalAchievement = await GoalAchievement.findByIdAndDelete(id);

    if (!goalAchievement) {
      res.status(200).json({ message: "Goal Achievement Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Goal Achievement!",
      goalAchievement: goalAchievement,
    });
  } catch (err) {
    console.log(err);
  }
};

const SingleGoalAchievement = async (req, res) => {
  try {
    const id = req.params.id;

    const goalAchievement = await GoalAchievement.findById(id).populate({
      path: "user",
    });

    if (!goalAchievement) {
      res.status(200).json({ message: "Goal Achievement Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Goal Achievement!",
      goalAchievement: goalAchievement,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getGoalAchievementList,
  addGoalAchievement,
  updateGoalAchievement,
  deleteGoalAchievement,
  SingleGoalAchievement,
};