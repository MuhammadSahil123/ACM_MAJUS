const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");

const getPostsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;
    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");
    const visibility = req.query.visibility;
    const user_id = req.query.user_id;
    const title = req.query.title;

    const startIndex = (page - 1) * limit;

    let query = { user: { $ne: authUser._id } };

    if (visibility && visibility !== "") {
      query.visibility = visibility;
    }

    if (!user_id) {
      if (authUser?.currentPlan?.name === "Premium") {
        query.plan_access = { $in: ["Free", "Basic", "Premium"] };
      } else if (authUser?.currentPlan?.name === "Basic") {
        query.plan_access = { $in: ["Free", "Basic"] };
      } else {
        query.plan_access = "Free";
      }
    }

    if (user_id && user_id !== "") {
      query.user = user_id;
    }

    if (title && title !== "") {
      query.title = { $regex: title, $options: "i" };
    }

    let posts;
    let pagination;
    const totalPosts = await Post.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      posts = await Post.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate("user", "first_name last_name profile")
        .populate({
          path: "comments.user",
          select: "first_name last_name profile",
        })
        .populate({
          path: "comments.replies.user",
          select: "first_name last_name profile",
        });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalPosts,
      };
    } else {
      posts = await Post.find().sort({ _id: -1 }).populate({
        path: "user",
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Posts!",
      posts: posts,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addPost = async (req, res) => {
  try {
    const { user, title, content, image, visibility } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    let newPost;

    if (authUser?.currentPlan?.name === "Free") {
      newPost = new Post({
        user: user,
        title: title,
        visibility: visibility,
        plan_access: authUser?.currentPlan?.name,
      });
    } else if (authUser?.currentPlan?.name === "Basic") {
      newPost = new Post({
        user: user,
        image: image,
        title: title,
        visibility: visibility,
        plan_access: authUser?.currentPlan?.name,
      });
    } else {
      newPost = new Post({
        user: user,
        image: image,
        title: title,
        visibility: visibility,
        plan_access: authUser?.currentPlan?.name,
        content: content,
      });
    }

    const newPostSave = await newPost.save();

    res
      .status(200)
      .json({ message: "Post created successfully!", post: newPostSave });
  } catch (err) {
    console.log(err);
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { user, title, content, image, visibility } = req.body;

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (authUser?.currentPlan?.name === "Free") {
      return res
        .status(403)
        .json({ message: "Free plan users cannot edit posts." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      post.user = user;
      post.title = title;
      post.content = content;
      post.image = image;
      post.visibility = visibility;

      const updatePost = await post.save();

      res.status(200).json({
        message: "SuccessFully Edit Post!",
        post: updatePost,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const addPostComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (authUser?.currentPlan?.name === "Free") {
      return res
        .status(403)
        .json({ message: "Free plan users cannot comment." });
    }

    const post = await Post.findById(postId).populate(
      "user",
      "first_name last_name profile"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = {
      user: authUser._id,
      content: content,
    };

    post.comments.push(comment);
    await post.save();

    await post.populate({
      path: "comments.user",
      select: "first_name last_name profile",
    });

    const newComment = post.comments.slice(-1)[0];

    res.status(200).json({
      message: "Comment added successfully!",
      comment: {
        _id: newComment._id,
        content: newComment.content,
        user: {
          first_name: newComment.user.first_name,
          last_name: newComment.user.last_name,
          profile: newComment.user.profile,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const addCommentReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (authUser?.currentPlan?.name === "Free") {
      return res
        .status(403)
        .json({ message: "Free plan users cannot reply to comments." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const reply = {
      user: authUser._id,
      content: content,
    };

    comment.replies.push(reply);

    await post.populate({
      path: "comments.replies.user",
      select: "first_name last_name profile",
    });

    const newReply = comment.replies.slice(-1)[0];

    res.status(200).json({
      message: "Reply added successfully!",
      reply: {
        _id: newReply._id,
        content: newReply.content,
        user: {
          first_name: newReply.user.first_name,
          last_name: newReply.user.last_name,
          profile: newReply.user.profile,
        },
      },
    });
    await post.save();
  } catch (err) {
    console.log(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    if (authUser?.currentPlan?.name === "Free") {
      return res
        .status(403)
        .json({ message: "Free plan users cannot delete posts." });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ message: "SuccessFully Delete Post!", post: post });
  } catch (err) {
    console.log(err);
  }
};

const singlePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findById(id)
      .populate("user", "first_name last_name profile")
      .populate({
        path: "comments.user",
        select: "first_name last_name profile",
      })
      .populate({
        path: "comments.replies.user",
        select: "first_name last_name profile",
      })
      .populate({
        path: "likedUsers",
        select: "first_name last_name profile",
      });

    if (!post) {
      res.status(200).json({ message: "Post Not Found!" });
    }

    post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      message: "SuccessFully Finded Post!",
      post: post,
    });
  } catch (err) {
    console.log(err);
  }
};

const likePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.body.user_id;

    const post = await Post.findById(post_id);

    if (post.likedUsers.includes(user_id)) {
      return res
        .status(400)
        .json({ message: "User has already liked this post" });
    }

    post.likes += 1;
    post.likedUsers = post.likedUsers || [];
    post.likedUsers.push(user_id);
    await post.save();

    res.status(200).json({ message: "Liked Post!", likes: post.likes });
  } catch (err) {
    console.log(err);
  }
};

const dislikePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.body.user_id;

    const authUser = await User.findById(req.user.user._id)
      .populate({ path: "role" })
      .populate("currentPlan");

    const post = await Post.findById(post_id);

    if (authUser?.currentPlan?.name === "Free") {
      return res.status(403).json({
        message: "Free plan users cannot dislike posts.",
        likes: post.likes,
      });
    }

    if (!post.likedUsers || !post.likedUsers.includes(user_id)) {
      return res.status(400).json({ msg: "User has not liked this post" });
    }

    post.likes -= 1;
    post.likedUsers = post.likedUsers.filter(
      (user) => user.toString() !== user_id
    );
    await post.save();

    res.status(200).json({ message: "Disliked Post!", likes: post.likes });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getPostsList,
  addPost,
  updatePost,
  addPostComment,
  deletePost,
  singlePost,
  likePost,
  dislikePost,
  addCommentReply,
};