const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    likes: { type: Number, default: 0 },
    replies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, trim: true },
    content: { type: String },
    image: { type: String },
    likes: { type: Number, default: 0 },
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    plan_access: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      default: "Free",
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);