const WorkoutCategory = require("../models/WorkoutCategory");
const User = require("../models/User");
const Progress = require("../models/Progress");
const { validationResult } = require("express-validator");

const getProgressList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const weight = parseInt(req.query.weight);
    const chest = parseInt(req.query.chest);
    const user_id = req.query.user_id;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let query = {};
    if (user_id && user_id !== "") {
      query.user = user_id;
    }

    if (weight && weight !== "") {
      query.weight = weight;
    }

    if (chest && chest !== "") {
      query["body_measurements.chest"] = chest;
    }

    let progress;
    let pagination;
    const totalProgress = await Progress.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      progress = await Progress.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "user",
        });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalProgress,
      };
    } else {
      progress = await Progress.find().sort({ _id: -1 });
    }

    res.status(200).json({
      message: "SuccessFully Finded Progress!",
      progress: progress,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const getRecentProgressList = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const limit = req.query.limit;

    const progress = await Progress.find({ user: user_id })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      message: "SuccessFully Finded Recent Progress!",
      progress: progress,
    });
  } catch (err) {
    console.log(err);
  }
};

const addProgress = async (req, res) => {
  try {
    const { user, weight, body_measurements, performance_metrics } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progress = new Progress({
      user: user,
      weight: weight,
      body_measurements: body_measurements,
      performance_metrics: performance_metrics,
    });

    const newProgress = await progress.save();

    res.status(200).json({
      message: "SuccessFully Add Progress!",
      progress: newProgress,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateProgress = async (req, res) => {
  try {
    const id = req.params.id;

    const { user, weight, body_measurements, performance_metrics } = req.body;

    const progress = await Progress.findById(id);

    if (!progress) {
      res.status(400).json({ message: "Progress Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      progress.user = user;
      progress.weight = weight;
      progress.body_measurements = body_measurements;
      progress.performance_metrics = performance_metrics;

      const updateProgress = await progress.save();

      res.status(200).json({
        message: "SuccessFully Updated Progress!",
        progress: updateProgress,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteProgress = async (req, res) => {
  try {
    const id = req.params.id;

    const progress = await Progress.findByIdAndDelete(id);

    if (!progress) {
      res.status(200).json({ message: "Progress Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Progress!",
      progress: progress,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleProgress = async (req, res) => {
  try {
    const id = req.params.id;

    const progress = await Progress.findById(id).populate({
      path: "user",
    });

    if (!progress) {
      res.status(200).json({ message: "Progress Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Progress!",
      progress: progress,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addProgress,
  updateProgress,
  deleteProgress,
  getSingleProgress,
  getProgressList,
  getRecentProgressList,
};