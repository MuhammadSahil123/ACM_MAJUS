
const { connectDB, disconnectDB } = require("../database/database");
const News = require("../models/News");

const news = [
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722020646236-967919051-news1.jpg",
    title: "my journey of championship in  weight lifting",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722020745965-928198419-news2.jpg",
    title: "how a good personal trainer can change the way of your life",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722020797368-685223902-news3.jpg",
    title: "what mistakes you are making while muscle building",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722020850519-439530635-news4.jpg",
    title: "importance of good trainer for weight l0ss journey",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722196772998-557086631-news5.jpg",
    title: "how To make cool physic in gym in 3 months",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722197071801-6010208-news6.jpg",
    title: "how gym cycling can help to have good metabolism",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722197224044-201774571-news7.jpg",
    title: "in home exercise with the help of good trainer",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
  {
    user: "60df6999e4b0c0c93408e2c1",
    image: "http://localhost:5000/uploads/1722197341076-822977032-news8.jpg",
    title: "useful tips for tone up & improve body strength",
    content:
      "Welcome to Wellness Gaines Fitness! We believe that true wellness encompasses the mind, body, and soul. Whether you’re just starting your fitness journey or are already making great strides towards your goals, we are here to support and guide you every step of the way.",
    tags: ["Barbell", "Fitness", "GYM", "Muscled"],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        full_name: "Muhammad Sahil",
        email: "sahil@gmail.com",
        comment: "This is my first comment.",
      },
    ],
  },
];

connectDB();

News.insertMany(news).then(() => {
  console.log("News Seed SuccessFully");
  disconnectDB();
});