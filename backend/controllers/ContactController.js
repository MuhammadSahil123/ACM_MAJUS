const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

const getContactsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const full_name = req.query.full_name;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;

    const startIndex = (page - 1) * limit;
    let query = {};

    if (full_name && full_name != "") {
      query.full_name = { $regex: full_name, $options: "i" };
    }

    let contacts;
    let pagination;
    const totalContacts = await Contact.countDocuments();

    if (paginationStatus && paginationStatus == 1) {
      contacts = await Contact.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit);
      pagination = {
        current_page: page,
        per_page: limit,
        total: totalContacts,
      };
    } else {
      contacts = await Contact.find().sort({ _id: -1 });
    }

    res.status(200).json({
      message: "SuccessFully Finded Contacts!",
      contacts: contacts,
      pagination,
    });
  } catch (err) {
    console.log(err);
  }
};

const addContact = async (req, res) => {
  try {
    const { ip, full_name, email, subject, message } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = new Contact({
      ip: ip,
      full_name: full_name,
      email: email,
      subject: subject,
      message: message,
    });

    await contact.save();

    res.status(200).json({
      message: "Thank you for your message. It has been sent.",
    });
  } catch (err) {
    console.log(err);
  }
};

const singleContact = async (req, res) => {
  try {
    const id = req.params.id;

    const contact = await Contact.findById(id);

    if (!contact) {
      res.status(400).json({ message: "Contact Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Finded Contact Details!",
      contact: contact,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      res.status(400).json({ message: "Contact Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Delete Contact Details!",
      contact: contact,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getContactsList,
  singleContact,
  addContact,
  deleteContact,
};