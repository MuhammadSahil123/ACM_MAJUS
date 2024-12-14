const { validationResult } = require("express-validator");
const News = require("../models/News");

const getNewsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;
    let query = {};

    let news;
    let pagination;
    const totalNews = await News.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      news = await News.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "user",
          select: "first_name last_name",
        });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalNews,
      };
    } else {
      news = await News.find().sort({ _id: -1 });
    }

    res.status(200).json({
      message: "SuccessFully Finded News!",
      news: news,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addNews = async (req, res) => {
  try {
    const { user, image, title, content, tags } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const news = new News({
      user: user,
      image: image,
      title: title,
      content: content,
      tags: tags,
    });

    const newNews = await news.save();

    res.status(200).json({
      message: "SuccessFully Add News!",
      news: newNews,
    });
  } catch (err) {
    console.log(err);
  }
};

const addComment = async (req, res) => {
  try {
    const id = req.params.id;

    const { user, full_name, email, comment } = req.body;

    const newsItem = await News.findById(id);

    if (!newsItem) {
      res.status(400).json({ message: "News Not Found!" });
    }

    const newComment = {
      user: user,
      full_name: full_name,
      email: email,
      comment: comment,
    };

    newsItem.comments.push(newComment);

    await newsItem.save();

    res.status(200).json({
      message: "Comment added successfully!",
    });
  } catch (err) {
    console.error(err);
  }
};

const getSingleNews = async (req, res) => {
  try {
    const id = req.params.id;

    const news = await News.findById(id).populate({
      path: "user",
    });

    if (!news) {
      res.status(200).json({ message: "News Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded News!",
      news: news,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getNewsList, addNews, addComment, getSingleNews };