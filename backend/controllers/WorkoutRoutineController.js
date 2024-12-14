const { validationResult } = require("express-validator");
const User = require("../models/User");
const WorkoutRoutine = require("../models/WorkoutRoutine");
const Notification = require("../models/Notification");
const { default: mongoose } = require("mongoose");
const GoalAchievement = require("../models/GoalAchievement");

const getWorkoutRoutinesList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const routine_name = req.query.routine_name;
    const category = req.query.category;
    const completed = req.query.completed;
    const pending = req.query.pending;
    const user_id = req.query.user_id;
    const paginationStatus = parseInt(req.query.paginationStatus, 10) || 0;

    const startIndex = (page - 1) * limit;

    let query = {};
    const user = await User.findById(user_id)
      .populate("role")
      .populate("currentPlan");

    if (user_id) {
      if (user.role._id == "60df6999e4b0c0c93408e2c4") {
        query.user = user_id;
        isAdmin = true;
      }

      if (
        user.role._id == "60df6999e4b0c0c93408e2c5" &&
        user?.currentPlan?.name == "Premium"
      ) {
        query.user = user_id;
      }
    } else {
      query.access = "Public";
    }

    if (category) {
      query.category = category;
    }
    if (routine_name) {
      query.routine_name = { $regex: routine_name, $options: "i" };
    }
    if (completed) {
      query.completed = completed === "true";
    }
    if (pending) {
      query.completed = pending === "true";
    }

    let selectFields =
      "routine_name category image short_description completed status comments plan_access createdAt";

    const totalWorkoutRoutines = await WorkoutRoutine.countDocuments(query);

    let workoutRoutines;
    if (paginationStatus === 1) {
      if (user && user.role._id == "60df6999e4b0c0c93408e2c4") {
        workoutRoutines = await WorkoutRoutine.find(query)
          .sort({ _id: -1 })
          .skip(startIndex)
          .limit(limit)
          .populate("category")
          .populate("user")
          .populate("comments.user", "first_name last_name")
          .select(selectFields);
      } else {
        workoutRoutines = await WorkoutRoutine.find(query)
          .sort({ _id: -1 })
          .skip(startIndex)
          .limit(limit)
          .populate("category")
          .populate("comments.user", "first_name last_name")
          .select(selectFields);
      }

      pagination = {
        current_page: page,
        per_page: limit,
        total: totalWorkoutRoutines,
      };
    } else {
      workoutRoutines = await WorkoutRoutine.find(query)
        .sort({ _id: -1 })
        .populate(isAdmin ? "user" : "")
        .populate("category")
        .populate("comments.user", "first_name last_name")
        .select(selectFields);
    }

    res.status(200).json({
      message: "Successfully Found Workout Routines!",
      workout_routines: workoutRoutines,
      pagination,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching workout routines.",
      error: err.message,
    });
  }
};

const getRecentWorkoutRoutinesList = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const limit = req.query.limit;

    const workoutRoutines = await WorkoutRoutine.find({ user: user_id })
      .sort({ _id: -1 })
      .limit(limit);

    res.status(200).json({
      message: "SuccessFully Finded Recent Workout Routines!",
      workout_routines: workoutRoutines,
    });
  } catch (err) {
    console.log(err);
  }
};

const getWorkoutRoutineAnalytics = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const objectId = new mongoose.Types.ObjectId(user_id);

    const workoutFrequency = await WorkoutRoutine.aggregate([
      { $match: { user: objectId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_created" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const liftingProgress = await WorkoutRoutine.aggregate([
      { $match: { user: objectId } },
      { $unwind: "$exercises" },
      {
        $project: {
          exercise_name: "$exercises.exercise_name",
          weights: {
            $toDouble: {
              $replaceAll: {
                input: "$exercises.weights",
                find: "kg",
                replacement: "",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$exercise_name",
          totalWeight: { $sum: "$weights" },
          count: { $sum: 1 },
        },
      },
    ]);

    const exerciseHistory = await WorkoutRoutine.find({ user: user_id }).sort({
      date_created: 1,
    });

    res.status(200).json({
      message: "Successfully found workout routines analytics!",
      workout_frequency: workoutFrequency,
      lifting_progress: liftingProgress,
      exercise_history: exerciseHistory,
    });
  } catch (err) {
    console.error(err);
  }
};

const checkUserGoals = async (user_id) => {
  try {
    const goals = await GoalAchievement.find({ user: user_id });

    const completedWorkoutsCount = await WorkoutRoutine.countDocuments({
      user: user_id,
      completed: true,
    });

    goals.forEach(async (goal) => {
      if (!goal.achieved) {
        if (
          goal.type === "workout_frequency" &&
          completedWorkoutsCount >= goal.target
        ) {
          await GoalAchievement.findByIdAndUpdate(goal._id, { achieved: true });
          await sendGoalAchievementNotification(user_id, goal.description);
        }
      }
    });
  } catch (err) {
    console.error("Error checking user goals:", err);
  }
};

const sendGoalAchievementNotification = async (user_id, goalDescription) => {
  try {
    const notification = new Notification({
      recipient: user_id,
      type: "goal_achievement",
      message: `Congratulations! You achieved your goal: ${goalDescription}`,
    });
    await notification.save();

    res.status(200).json({
      message: "Goal Achievement completed and notification sent!",
    });
  } catch (err) {
    console.log(err);
  }
};

const completeWorkout = async (req, res) => {
  try {
    const { workout_id, user_id } = req.body;

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    const isAdmin = authUser.role && authUser.role.name === "Admin";

    const isPremiumUser =
      authUser.currentPlan && authUser.currentPlan.name === "Premium";

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (!isAdmin && (!isPremiumUser || isPlanExpired)) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    const routine = await WorkoutRoutine.findOne({
      _id: workout_id,
      user: authUser._id,
    });
    if (!routine) {
      return res.status(404).json({ error: "Workout not found" });
    }

    routine.status = "Completed";
    routine.completed = true;
    await routine.save();

    const notification = new Notification({
      recipient: authUser._id,
      sender: routine._id,
      workout_routine: routine._id,
      type: "workout_completion",
      message: "You completed a workout!",
    });
    await notification.save();
    await checkUserGoals(user_id);

    res
      .status(200)
      .json({ message: "Workout completed and notification sent!" });
  } catch (err) {
    console.log(err);
  }
};

const addRoutine = async (req, res) => {
  try {
    const {
      user,
      category,
      routine_name,
      force,
      image,
      short_description,
      exercises,
      duration,
      difficulty_level,
      plan_access,
      status,
      access,
      instructions,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    const isAdmin = authUser.role && authUser.role.name === "Admin";

    const isPremiumUser =
      authUser.currentPlan && authUser.currentPlan.name === "Premium";

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (!isAdmin && (!isPremiumUser || isPlanExpired)) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    const routine = new WorkoutRoutine({
      category: category,
      user: user,
      routine_name: routine_name,
      force: force,
      image: image,
      short_description: short_description,
      exercises: exercises,
      duration: duration,
      difficulty_level: difficulty_level,
      plan_access: plan_access,
      status: status,
      access: access,
      instructions: instructions,
    });

    const newRoutine = await routine.save();

    res.status(200).json({
      message: "SuccessFully Add Workout Routine!",
      routine: newRoutine,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateRoutine = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      user,
      category,
      routine_name,
      force,
      image,
      short_description,
      exercises,
      duration,
      difficulty_level,
      plan_access,
      status,
      access,
      instructions,
    } = req.body;

    const routine = await WorkoutRoutine.findById(id);

    if (!routine) {
      res.status(400).json({ message: "Workout Routine Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authUser = await User.findById(req.user.user._id)
        .populate({ path: "role" })
        .populate("currentPlan");

      const isAdmin = authUser.role && authUser.role.name === "Admin";

      const isPremiumUser =
        authUser.currentPlan && authUser.currentPlan.name === "Premium";

      const currentDate = new Date();
      const planExpirationDate = authUser?.planExpiryDate;
      const isPlanExpired =
        planExpirationDate && currentDate > new Date(planExpirationDate);

      if (!isAdmin && (!isPremiumUser || isPlanExpired)) {
        return res.status(403).json({
          message: "Access Denied! Your plan may be expired.",
        });
      }

      routine.category = category;
      routine.user = user;
      routine.routine_name = routine_name;
      routine.force = force;
      routine.image = image;
      routine.short_description = short_description;
      routine.exercises = exercises;
      routine.duration = duration;
      routine.difficulty_level = difficulty_level;
      routine.plan_access = plan_access;
      routine.status = status;
      routine.access = access;
      routine.instructions = instructions;

      const updateRoutine = await routine.save();

      res.status(200).json({
        message: "SuccessFully Updated Workout Routine!",
        routine: updateRoutine,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteRoutine = async (req, res) => {
  try {
    const id = req.params.id;

    const routine = await WorkoutRoutine.findById(id);

    if (!routine) {
      return res.status(404).json({ message: "Workout Routine Not Found!" });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    const isAdmin = authUser.role && authUser.role.name === "Admin";
    const isPremiumUser =
      authUser.currentPlan && authUser.currentPlan.name === "Premium";

    const currentDate = new Date();
    const planExpirationDate = authUser?.planExpiryDate;
    const isPlanExpired =
      planExpirationDate && currentDate > new Date(planExpirationDate);

    if (!isAdmin && (!isPremiumUser || isPlanExpired)) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    await WorkoutRoutine.findByIdAndDelete(id);

    res.status(200).json({
      message: "Successfully Deleted Workout Routine!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while deleting the workout routine.",
      error: err.message,
    });
  }
};

const SingleRoutine = async (req, res) => {
  try {
    const id = req.params.id;

    const routine = await WorkoutRoutine.findById(id)
      .populate({
        path: "user",
      })
      .populate({
        path: "category",
      })
      .populate("comments.user", "first_name last_name profile");

    if (!routine) {
      res.status(200).json({ message: "Workout Routine Not Found!" });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    const isAdmin = authUser.role && authUser.role.name === "Admin";
    const isPremiumUser =
      authUser.currentPlan && authUser.currentPlan.name === "Premium";

    if (!isAdmin && !isPremiumUser) {
      return res.status(403).json({
        message: "Access Denied! Your plan may be expired.",
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Workout Routine!",
      routine: routine,
    });
  } catch (err) {
    console.log(err);
  }
};

const FreeSingleRoutine = async (req, res) => {
  try {
    const id = req.params.id;

    const routine = await WorkoutRoutine.findById(id).populate({
      path: "category",
    });

    if (!routine) {
      res.status(200).json({ message: "Workout Routine Not Found!" });
    }

    if (routine.plan_access === "Basic" || routine.plan_access === "Premium") {
      return res.status(403).json({ message: "Access Denied!" });
    }

    res.status(200).json({
      message: "SuccessFully Found Workout Routine!",
      routine: routine,
    });
  } catch (err) {
    console.log(err);
  }
};

const BasicPremiumSingleWorkoutRoutine = async (req, res) => {
  try {
    const { planType, id } = req.params;
    const routine = await WorkoutRoutine.findById(id)
      .populate({
        path: "user",
      })
      .populate({
        path: "category",
      });

    if (!routine) {
      return res.status(404).json({ message: "Workout Routine Not Found!" });
    }

    res.status(200).json({
      message: "Successfully Found Workout Routine!",
      routine: routine,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addRoutine,
  completeWorkout,
  updateRoutine,
  deleteRoutine,
  SingleRoutine,
  getWorkoutRoutinesList,
  getRecentWorkoutRoutinesList,
  getWorkoutRoutineAnalytics,
  FreeSingleRoutine,
  BasicPremiumSingleWorkoutRoutine,
};