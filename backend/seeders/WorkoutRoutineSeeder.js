const { connectDB, disconnectDB } = require("../database/database");
const WorkoutRoutine = require("../models/WorkoutRoutine");

const workoutRoutines = [
  {
    user: "60df6999e4b0c0c93408e2c1",
    category: "668ee7fb9514664ecd3c246c",
    routine_name: "3/4 Sit-Up",
    force: "Pull",
    image: "http://localhost:5000/uploads/1726261183430-989218103-image1.jpg",
    short_description:
      "The 3/4 Sit-Up focuses on upper and middle abs by lifting your torso three-quarters up. It’s a safer alternative to full sit-ups with less lower back strain.",
    exercises: [
      {
        exercise_name: "3/4 Sit-Up",
        sets: 3,
        reps: 15,
        weight: "Bodyweight",
        rest_time: 30,
        notes: "Keep core tight and avoid pulling with neck.",
      },
      {
        exercise_name: "Plank",
        sets: 3,
        reps: 60,
        weight: "Bodyweight",
        rest_time: 45,
        notes: "Maintain a straight line from head to heels.",
      },
      {
        exercise_name: "Bicycle Crunch",
        sets: 3,
        reps: 20,
        weight: "Bodyweight",
        rest_time: 30,
        notes: "Focus on engaging the obliques.",
      },
      {
        exercise_name: "Russian Twists",
        sets: 3,
        reps: 20,
        weight: "10kg Plate",
        rest_time: 30,
        notes: "Rotate fully but keep hips stable.",
      },
      {
        exercise_name: "Leg Raises",
        sets: 3,
        reps: 12,
        weight: "Bodyweight",
        rest_time: 45,
        notes: "Keep legs straight and control the descent.",
      },
    ],
    duration: "60 minutes",
    difficulty_level: "Beginner",
    plan_access: "Free",
    completed: true,
    status: "Completed",
    access: "Public",
    instructions: [
      "Lie down on the floor and secure your feet. Your legs should be bent at the knees.",
      "Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.",
      "Flex your hips and spine to raise your torso toward your knees.",
      "At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only Â¾ of the way down.",
      "Repeat for the recommended amount of repetitions.",
    ],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        content:
          "I usually try to keep my core tight and focus on controlled movements. Also, placing a small towel under your lower back can help with support during 3/4 Sit-Ups.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    category: "668ee7fb9514664ecd3c253c",
    routine_name: "90/90 Hamstring",
    force: "Push",
    image: "http://localhost:5000/uploads/1726261787861-995523584-image3.jpg",
    short_description:
      "The 90/90 Hamstring stretch improves hip mobility and stretches hamstrings by sitting with one leg bent in front and the other behind. Great for lower body flexibility.",
    exercises: [
      {
        exercise_name: "90/90 Hamstring Stretch",
        sets: 3,
        reps: 30,
        weight: "Bodyweight",
        rest_time: 30,
        notes: "Focus on keeping the back straight while leaning forward.",
      },
      {
        exercise_name: "Glute Bridge",
        sets: 3,
        reps: 12,
        weight: "Bodyweight",
        rest_time: 60,
        notes: "Engage the hamstrings and glutes as you lift your hips.",
      },
      {
        exercise_name: "Romanian Deadlift",
        sets: 4,
        reps: 10,
        weight: "40 lbs",
        rest_time: 90,
        notes:
          "Keep a slight bend in the knees and stretch the hamstrings as you lower the weights.",
      },
      {
        exercise_name: "Standing Hamstring Stretch",
        sets: 3,
        reps: 30,
        weight: "Bodyweight",
        rest_time: 30,
        notes: "Keep legs straight and lean forward to stretch the hamstrings.",
      },
    ],
    duration: "1 minute 30 seconds",
    difficulty_level: "Beginner",
    plan_access: "Basic",
    completed: true,
    status: "Completed",
    access: "Public",
    instructions: [
      "Lie on your back, with one leg extended straight out.",
      "With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.",
      "Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.",
      "Repeat for 10-20 repetitions, and then switch to the other leg.",
    ],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        content:
          "The 90/90 Hamstring routine targets hamstring flexibility and glute strength, enhancing mobility and posture. It helps reduce lower back tension while improving range of motion, making it ideal for athletes and fitness enthusiasts.",
      },
    ],
  },
  
  
];

connectDB();

WorkoutRoutine.insertMany(workoutRoutines).then(() => {
  console.log("Workout Routine Seed SuccessFully");
  disconnectDB();
});