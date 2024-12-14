const { connectDB, disconnectDB } = require("../database/database");
const Post = require("../models/Post");

const posts = [
  {
    user: "60df6999e4b0c0c93408e2c1",
    title: "Exploring the Great Outdoors",
    content:
      "Join me as I explore the beauty of nature through hiking and camping.",
    image:
      "http://localhost:5000/uploads/1727295238540-408094638-A-Kids-Guide-To-Exploring-The-Great-Outdoors.jpg",
    likes: 0,
    likedUsers: [],
    comments: [
      {
        user: "60df6999e4b0c0c93408e2c1",
        content: "Looks amazing! Where is this?",
        replies: [
          {
            user: "60df6999e4b0c0c93408e2c1",
            content: "This is Amazing Comment!",
          },
        ],
      },
      {
        user: "60df6999e4b0c0c93408e2c1",
        content: "I need to visit this place!",
        replies: [
          {
            user: "60df6999e4b0c0c93408e2c1",
            content: "This is Amazing Comment!",
          },
        ],
      },
    ],
    plan_access: "Free",
    visibility: "Public",
  },
  
];

connectDB();

Post.insertMany(posts).then(() => {
  console.log("Posts Seed SuccessFully");
  disconnectDB();
});