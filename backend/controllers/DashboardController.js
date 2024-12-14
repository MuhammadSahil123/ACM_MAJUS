const Nutrition = require("../models/Nutrition");
const Progress = require("../models/Progress");
const WorkoutRoutine = require("../models/WorkoutRoutine");
const GoalAchievement = require("../models/GoalAchievement");
const Contact = require("../models/Contact");
const News = require("../models/News");
const Role = require("../models/Role");
const User = require("../models/User");
const Notification = require("../models/Notification");
const WorkoutCategory = require("../models/WorkoutCategory");
const Goal = require("../models/GoalAchievement");
const Post = require("../models/Post");

const getDashboarsStats = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const user = await User.findById(user_id)
      .populate({ path: "role" })
      .populate("currentPlan");
    const workoutRoutines = await WorkoutRoutine.countDocuments();

    const workoutRoutinesCompleted = await WorkoutRoutine.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
            completed: true,
          }
        : { completed: true }
    );
    const userPersonalWorkoutPlans = await WorkoutRoutine.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
          }
        : {}
    );

    const workoutRoutinesNotCompleted = await WorkoutRoutine.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
            completed: false,
          }
        : { completed: false }
    );
    const nutritions = await Nutrition.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
          }
        : {}
    );
    const progress = await Progress.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
          }
        : {}
    );
    const goalAchievements = await GoalAchievement.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
          }
        : {}
    );
    const posts = await Post.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
          }
        : {}
    );
    const goalAchievementsAchieved = await GoalAchievement.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
            achieved: true,
          }
        : { achieved: true }
    );
    const goalAchievementsNotAchieved = await GoalAchievement.countDocuments(
      user_id && user_id !== ""
        ? {
            user: user_id,
            achieved: false,
          }
        : { achieved: false }
    );

    let dashboard_stats = {
      workout_routines: workoutRoutines,
      nutritions: nutritions,
      progress: progress,
      goal_achievements: goalAchievements,
      posts: posts,
    };

    if (user_id && user_id !== "") {
      dashboard_stats.goal_achievements_achieved = goalAchievementsAchieved;
      dashboard_stats.goal_achievements_not_achieved =
        goalAchievementsNotAchieved;
      dashboard_stats.workout_routines_completed = workoutRoutinesCompleted;
      dashboard_stats.workout_routines_not_completed =
        workoutRoutinesNotCompleted;

      if (
        user &&
        user.role._id == "60df6999e4b0c0c93408e2c5" &&
        user.currentPlan.name == "Premium"
      ) {
        dashboard_stats.personal_workouts = userPersonalWorkoutPlans;
      }
    }

    if (!user_id || user_id == "") {
      const contacts = await Contact.countDocuments();
      const news = await News.countDocuments();
      const roles = await Role.countDocuments();
      const users = await User.countDocuments();
      const notifications = await Notification.countDocuments();
      const workout_categories = await WorkoutCategory.countDocuments();
      const goals = await Goal.countDocuments();
      dashboard_stats.contacts = contacts;
      dashboard_stats.news = news;
      dashboard_stats.roles = roles;
      dashboard_stats.users = users;
      dashboard_stats.notifications = notifications;
      dashboard_stats.workout_categories = workout_categories;
      dashboard_stats.goals = goals;
    }

    res.status(200).json({
      message: "SuccessFully Finded Dashboard Stats!",
      dashboard_stats: dashboard_stats,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = getDashboarsStats;