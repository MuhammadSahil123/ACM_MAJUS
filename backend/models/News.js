const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  full_name: { type: String },
  email: { type: String },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const NewsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String },
  title: { type: String },
  content: { type: String },
  tags: {
    type: [String],
  },
  comments: [CommentSchema],
});

NewsSchema.set("timestamps", true);

module.exports = mongoose.model("News", NewsSchema);