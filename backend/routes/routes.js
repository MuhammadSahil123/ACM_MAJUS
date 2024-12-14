const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/AuthMiddleware");
const UploadImage = require("../controllers/GenericController");
const routes = express.Router();
const AuthenticationDataValidator = require("../dataValidators/AuthenicationDataValidator");
const {
  loginUser,
  getUsersList,
  deleteUser,
  addUser,
  SingleUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassowrd,
  changePassowrd,
  registerUser,
  currentUser,
} = require("../controllers/UserController");
const {
  CreateUserDataValidator,
  UpdateUserDataValidator,
} = require("../dataValidators/UserDataValidator");
const {
  getRolesList,
  editRole,
  deleteRole,
  singleRole,
  addRole,
} = require("../controllers/RoleController");
const RoleDataValidator = require("../dataValidators/RoleDataValidator");
const WorkoutRoutineDataValidator = require("../dataValidators/WorkoutRoutineDataValidator");
const {
  addRoutine,
  getWorkoutRoutinesList,
  updateRoutine,
  deleteRoutine,
  SingleRoutine,
  getRecentWorkoutRoutinesList,
  getWorkoutRoutineAnalytics,
  completeWorkout,
  FreeSingleRoutine,
  BasicPremiumSingleWorkoutRoutine,
} = require("../controllers/WorkoutRoutineController");
const {
  getWorkoutCategoriesList,
  addWorkoutCategory,
  editWorkoutCategory,
  deleteWorkoutCategory,
  singleWorkoutCategory,
} = require("../controllers/WorkoutCategoryController");
const {
  getFoodsList,
  addFood,
  updateFood,
  deleteFood,
  singleFood,
  getRecentFoodsList,
  getFoodsAnalytics,
  foodDataExportToCsv,
} = require("../controllers/NutritionController");
const NutritionDataValidator = require("../dataValidators/NutritionDataValidator");
const {
  getProgressList,
  addProgress,
  updateProgress,
  deleteProgress,
  getSingleProgress,
  getRecentProgressList,
} = require("../controllers/ProgressController");
const ProgressDataValidator = require("../dataValidators/ProgressDataValidator");
const getDashboarsStats = require("../controllers/DashboardController");
const {
  getNotificationsList,
  markNotificationAsRead,
  addNotification,
  SingleNotification,
  deleteNotification,
} = require("../controllers/NotificationController");
const NotificationDataValidator = require("../dataValidators/NotificationDatavalidators");
const {
  getGoalAchievementList,
  addGoalAchievement,
  deleteGoalAchievement,
  SingleGoalAchievement,
  updateGoalAchievement,
} = require("../controllers/GoalAchievementController");
const GoalAchievementDataValidator = require("../dataValidators/GoalAcheivementDatavalidators");
const ContactDataValidator = require("../dataValidators/contactDataValidators");
const {
  addContact,
  getContactsList,
  singleContact,
  deleteContact,
} = require("../controllers/ContactController");
const {
  getNewsList,
  addNews,
  addComment,
  getSingleNews,
} = require("../controllers/NewsController");
const NewsDataValidator = require("../dataValidators/NewsDataValidators");
const roleMiddleware = require("../middlewares/RoleMiddleware");
const WorkoutCategoryDataValidator = require("../dataValidators/WorkoutCategoryDataValidator");
const {
  getSessionsList,
  deleteSession,
} = require("../controllers/SessionController");
const {
  getSubscriptionPlansList,
  subscriptionPlanSelect,
  verifyPayment,
} = require("../controllers/SubscriptionPlanController");
const planAuthorizationMiddleware = require("../middlewares/planAuthorizationMiddleware");
const {
  getPostsList,
  addPost,
  updatePost,
  deletePost,
  singlePost,
  addPostComment,
  likePost,
  dislikePost,
  addCommentReply,
} = require("../controllers/PostController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ======== Public Routes ========

routes.post("/login", AuthenticationDataValidator, loginUser);
routes.post("/register", CreateUserDataValidator, registerUser);
routes.post("/users/add", CreateUserDataValidator, addUser);
routes.get("/roles/show", singleRole);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password/:token", resetPassowrd);
routes.get("/current-user", currentUser);
routes.post("/contacts/send", ContactDataValidator, addContact);
routes.post("/upload_image", upload.single("image"), UploadImage);

routes.get("/subscription-plans/index", getSubscriptionPlansList);
routes.post(
  "/subscription-plans/select",
  authMiddleware,
  subscriptionPlanSelect
);
routes.post("/payment/verify", authMiddleware, verifyPayment);

// ======== Private Routes ========

routes.post("/logout", logoutUser);

// Dashboard Routes
routes.get("/dashboard/stats", authMiddleware, getDashboarsStats);

// Roles Routes
routes.get(
  "/roles/index",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  getRolesList
);
routes.post(
  "/roles/add",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  RoleDataValidator,
  addRole
);
routes.put(
  "/roles/edit/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  RoleDataValidator,
  editRole
);
routes.delete(
  "/roles/delete/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  deleteRole
);

// Users Routes
routes.put(
  "/users/edit/:id",
  authMiddleware,
  UpdateUserDataValidator,
  updateUser
);
routes.get(
  "/users/index",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  getUsersList
);
routes.get("/users/show/:id", authMiddleware, SingleUser);
routes.delete(
  "/users/delete/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  deleteUser
);
routes.post("/change-password/:id", authMiddleware, changePassowrd);

// Sessions Routes
routes.get(
  "/sessions/index",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  getSessionsList
);
routes.delete(
  "/sessions/delete/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  deleteSession
);

// Workout Routine Routes
routes.post(
  "/workout-routines/add",
  authMiddleware,
  WorkoutRoutineDataValidator,
  addRoutine
);
routes.post("/workout-routines/complete", authMiddleware, completeWorkout);
routes.put(
  "/workout-routines/edit/:id",
  authMiddleware,
  WorkoutRoutineDataValidator,
  updateRoutine
);
routes.delete("/workout-routines/delete/:id", authMiddleware, deleteRoutine);
routes.get("/workout-routines/show/:id", authMiddleware, SingleRoutine);
routes.get("/workout-routines/free/:id", FreeSingleRoutine);
routes.get(
  "/workout-routines/:planType/:id",
  authMiddleware,
  planAuthorizationMiddleware(["Basic", "Premium"]),
  BasicPremiumSingleWorkoutRoutine
);
routes.get("/workout-routines/index", getWorkoutRoutinesList);
routes.get(
  "/workout-routines/recent",
  authMiddleware,
  getRecentWorkoutRoutinesList
);
routes.get(
  "/workout-routines/analytics",
  authMiddleware,
  getWorkoutRoutineAnalytics
);

// Workout Categories Routes
routes.get("/workout-categories/index", getWorkoutCategoriesList);
routes.get(
  "/workout-categories/show/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  singleWorkoutCategory
);
routes.post(
  "/workout-categories/add",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  WorkoutCategoryDataValidator,
  addWorkoutCategory
);
routes.put(
  "/workout-categories/edit/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  WorkoutCategoryDataValidator,
  editWorkoutCategory
);
routes.delete(
  "/workout-categories/delete/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  deleteWorkoutCategory
);

// Foods Routes
routes.get("/nutritions/index", getFoodsList);
routes.get("/nutritions/export", authMiddleware, foodDataExportToCsv);
routes.get("/nutritions/recent", authMiddleware, getRecentFoodsList);
routes.get("/nutritions/analytics", authMiddleware, getFoodsAnalytics);
routes.post("/nutritions/add", authMiddleware, NutritionDataValidator, addFood);
routes.put(
  "/nutritions/edit/:id",
  authMiddleware,
  NutritionDataValidator,
  updateFood
);
routes.delete("/nutritions/delete/:id", authMiddleware, deleteFood);
routes.get("/nutritions/show/:id", singleFood);

// Posts Routes
routes.get("/posts/index", authMiddleware, getPostsList);
routes.post("/posts/add", authMiddleware, addPost);
routes.put("/posts/edit/:id", authMiddleware, updatePost);
routes.delete("/posts/delete/:id", authMiddleware, deletePost);
routes.get("/posts/show/:id", authMiddleware, singlePost);
routes.post("/posts/:postId/comments/add", authMiddleware, addPostComment);
routes.post("/posts/:id/like", authMiddleware, likePost);
routes.post("/posts/:id/dislike", authMiddleware, dislikePost);
routes.post(
  "/posts/:postId/comment/:commentId/reply",
  authMiddleware,
  addCommentReply
);

// Progress Routes
routes.get("/progress/index", authMiddleware, getProgressList);
routes.post(
  "/progress/add",
  authMiddleware,
  ProgressDataValidator,
  addProgress
);
routes.put(
  "/progress/edit/:id",
  authMiddleware,
  ProgressDataValidator,
  updateProgress
);
routes.delete("/progress/delete/:id", authMiddleware, deleteProgress);
routes.get("/progress/show/:id", authMiddleware, getSingleProgress);
routes.get("/progress/recent", authMiddleware, getRecentProgressList);

// Notification Routes
routes.get("/notifications/index", authMiddleware, getNotificationsList);
routes.post(
  "/notifications/add",
  authMiddleware,
  NotificationDataValidator,
  addNotification
);
routes.put("/notifications/:id/read", markNotificationAsRead);
routes.get("/notifications/show/:id", authMiddleware, SingleNotification);
routes.delete("/notifications/delete/:id", authMiddleware, deleteNotification);

// Goal Achievement Routes
routes.get("/goal-achievements/index", authMiddleware, getGoalAchievementList);
routes.post(
  "/goal-achievements/add",
  authMiddleware,
  GoalAchievementDataValidator,
  addGoalAchievement
);
routes.put(
  "/goal-achievements/edit/:id",
  authMiddleware,
  GoalAchievementDataValidator,
  updateGoalAchievement
);
routes.delete(
  "/goal-achievements/delete/:id",
  authMiddleware,
  deleteGoalAchievement
);
routes.get(
  "/goal-achievements/show/:id",
  authMiddleware,
  SingleGoalAchievement
);

// News Routes
routes.get("/news/index", getNewsList);
routes.post("/news/add", authMiddleware, NewsDataValidator, addNews);
routes.post("/news/:id/comments/add", NewsDataValidator, addComment);
routes.get("/news/show/:id", getSingleNews);

// Contacts Routes
routes.get(
  "/contacts/index",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  getContactsList
);
routes.get(
  "/contacts/show/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  singleContact
);
routes.delete(
  "/contacts/delete/:id",
  authMiddleware,
  roleMiddleware("60df6999e4b0c0c93408e2c4"),
  deleteContact
);

module.exports = routes;