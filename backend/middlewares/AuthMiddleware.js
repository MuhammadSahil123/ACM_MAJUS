const jwt = require("jsonwebtoken");
const secret_key = "dhjhXighDGDDuUDGD";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    res.status(401).json({
      message: "Access Denied!",
    });

  jwt.verify(token, secret_key, (err, user) => {
    if (err)
      res.status(401).json({
        message: "Invalid Token!",
      });

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;