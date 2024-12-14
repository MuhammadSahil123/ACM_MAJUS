const { validationResult } = require("express-validator");
const Notification = require("../models/Notification");

const getNotificationsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const user_id = req.query.user_id;
    const type = req.query.type;
    const mark_as_read = req.query.mark_as_read;
    const readed = req.query.readed;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;
    let query = {};

    if (user_id && user_id != "") {
      query.recipient = user_id;
    }

    if (type && type != "") {
      query.type = type;
    }

    if (mark_as_read) {
      query.read = mark_as_read;
    }

    if (readed) {
      query.read = readed;
    }

    let notifications;
    let pagination;
    const totalNotifications = await Notification.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      notifications = await Notification.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({ path: "recipient" });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalNotifications,
      };
    } else {
      notifications = await Notification.find().sort({ _id: -1 });
    }

    res.status(200).json({
      message: "SuccessFully Finded Notifications!",
      notifications: notifications,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addNotification = async (req, res) => {
  try {
    const { recipient, sender, type, message, read } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notification = new Notification({
      recipient: recipient,
      sender: sender,
      type: type,
      message: message,
      read: read,
    });

    const newNotification = await notification.save();

    res.status(200).json({
      message: "SuccessFully Add Notification!",
      notification: newNotification,
    });
  } catch (err) {
    console.log(err);
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const id = req.params.id;

    const notification = await Notification.findById(id);

    if (!notification) {
      res.status(200).json({ message: "Notification Not Found!" });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read!",
    });
  } catch (err) {
    console.log(err);
  }
};

const SingleNotification = async (req, res) => {
  try {
    const id = req.params.id;

    const notification = await Notification.findById(id).populate({
      path: "recipient",
    });

    if (!notification) {
      res.status(200).json({ message: "Notification Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Notification!",
      notification: notification,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      res.status(200).json({ message: "Notification Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Notification!",
      notification: notification,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getNotificationsList,
  addNotification,
  markNotificationAsRead,
  SingleNotification,
  deleteNotification,
};