const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Role = require("../models/Role");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");
const secret_key = "dhjhXighDGDDuUDGD";
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const useragent = require("useragent");
const fs = require("fs");

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const getUsersList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const email = req.query.email;
    const role = req.query.role;
    const gender = req.query.gender;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;

    let query = {};

    if (email && email != "") {
      query.email = new RegExp(`^${email}`, "i");
    }

    if (role && role != "") {
      query.role = role;
    }

    if (gender && gender != "") {
      query.gender = gender;
    }

    let users;
    let pagination;
    const totalUsers = await User.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      users = await User.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "role",
        });
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalUsers,
      };
    } else {
      users = await User.find().sort({ _id: -1 }).populate({
        path: "role",
      });
    }

    res.status(200).json({
      message: "SuccessFully Finded Users!",
      users: users,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const registerUser = async (req, res) => {
  try {
    const {
      role,
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      gender,
      phone_number,
      address,
      profile,
      ip,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const freePlan = await SubscriptionPlan.findOne({ name: "Free" });

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    if (user) {
      res.status(400).json({ message: "Email already exist!" });
    } else {
      const newUser = new User({
        role: role,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        date_of_birth: date_of_birth,
        gender: gender,
        phone_number: phone_number,
        address: address,
        profile: profile,
        ip: ip,
        currentPlan: freePlan._id,
        planExpiryDate: expiryDate,
        paymentStatus: "Completed",
        hasUsedFreePlan: true,
      });

      const newUserSave = await newUser.save();

      const token = jwt.sign({ user: newUserSave }, secret_key, {
        expiresIn: "1h",
      });

      const agent = useragent.parse(req.headers["user-agent"]);
      const deviceInfo = `${agent.family} on ${agent.os.family}`;

      const session = new Session({
        user: newUserSave._id,
        ipAddress: ip,
        deviceInfo: deviceInfo,
        token: token,
      });

      await session.save();

      res.status(200).json({
        message: "SuccessFully Registration!",
        user: newUserSave,
        token: token,
        user_id: newUserSave._id,
        role: newUserSave.role._id,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, ip } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: email })
      .populate({
        path: "role",
      })
      .populate("currentPlan");

    if (!user) {
      res.status(400).json({ message: "This email account not found!" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user: user }, secret_key, {
        expiresIn: "1h",
      });

      const agent = useragent.parse(req.headers["user-agent"]);
      const deviceInfo = `${agent.family} on ${agent.os.family}`;

      const session = new Session({
        user: user._id,
        ipAddress: ip,
        deviceInfo: deviceInfo,
        token: token,
      });

      await session.save();

      res.status(200).json({
        message: "SuccessFully Login Now!",
        token: token,
        user_id: user._id,
        role: user.role._id,
      });
    } else {
      res.status(400).json({
        message: "Invalid Credential!",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).send({
      message: "Logged Out!",
    });
  } catch (err) {
    console.log(err);
  }
};

const addUser = async (req, res) => {
  try {
    const {
      role,
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      gender,
      phone_number,
      address,
      profile,
      ip,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const freePlan = await SubscriptionPlan.findOne({ name: "Free" });

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    if (user) {
      res.status(400).json({ message: "Email already exist!" });
    } else {
      const newUser = new User({
        role: role,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        date_of_birth: date_of_birth,
        gender: gender,
        phone_number: phone_number,
        address: address,
        profile: profile,
        ip: ip,
        currentPlan: freePlan._id,
        planExpiryDate: expiryDate,
        paymentStatus: "Completed",
        hasUsedFreePlan: true,
      });

      const newUserSave = await newUser.save();

      res.status(200).json({
        message: "SuccessFully Registration!",
        user: newUserSave,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      role,
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      gender,
      phone_number,
      address,
      profile,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(200).json({ message: "User Not Found!" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      if (password && password != "") {
        user.password = await bcrypt.hash(password, 10);
      }

      user.role = role;
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.date_of_birth = date_of_birth;
      user.gender = gender;
      user.phone_number = phone_number;
      user.address = address;
      user.profile = profile;

      const updateUserSave = await user.save();

      res.status(200).json({
        message: "SuccessFully Updated User!",
        user: updateUserSave,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(200).json({ message: "User Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted User!",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

const SingleUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id)
      .populate({
        path: "role",
      })
      .populate("currentPlan");

    if (!user) {
      res.status(200).json({ message: "User Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded User!",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "personalwork270@gmail.com",
        pass: "pgzxiozsffnldutq",
      },
    });

    readHTMLFile(__dirname + "/../templates/resetPassword.hbs", (err, html) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Failed to load email template" });
      }

      const template = handlebars.compile(html);
      const replacements = {
        name: user.email,
        resetLink: `http://localhost:3000/reset-password/${token}`,
      };
      const htmlToSend = template(replacements);

      const mailOptions = {
        to: user.email,
        from: "passwordreset@example.com",
        subject: "Password Reset",
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Failed to send password reset email" });
        }
        res.status(200).json({ message: "Password reset email sent" });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const resetPassowrd = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    console.error(err);
  }
};

const changePassowrd = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();

    res.status(200).json({ message: "Password Has Been Changed!" });
  } catch (err) {
    console.error(err);
  }
};

const currentUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, secret_key);

    const user = await User.findById(decoded.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  getUsersList,
  addUser,
  updateUser,
  deleteUser,
  SingleUser,
  forgotPassword,
  resetPassowrd,
  changePassowrd,
  currentUser,
  registerUser,
};