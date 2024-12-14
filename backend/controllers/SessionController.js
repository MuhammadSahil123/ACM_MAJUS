const Session = require("../models/Session");

const getSessionsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginationStatus = parseInt(req.query.paginationStatus) || 0;
    const user_id = req.query.user_id;

    const startIndex = (page - 1) * limit;

    let query = {};
    if (user_id && user_id !== "") {
      query.user = user_id;
    }

    let sessions;
    let pagination;
    const totalSessions = await Session.countDocuments(query);

    if (paginationStatus && paginationStatus == 1) {
      sessions = await Session.find(query)
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate({
          path: "user",
        });

      pagination = {
        current_page: page,
        per_page: limit,
        total: totalSessions,
      };

      res.status(200).json({
        message: "Successfully Found Sessions!",
        sessions: sessions,
        pagination,
      });
    } else {
      sessions = await Session.find(query).sort({ _id: -1 }).populate({
        path: "user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while fetching sessions.",
      error: err.message,
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    const id = req.params.id;

    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      res.status(200).json({ message: "Session Not Found!" });
    }

    res.status(200).json({
      message: "SuccessFully Deleted Session!",
      session: session,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSessionsList, deleteSession };