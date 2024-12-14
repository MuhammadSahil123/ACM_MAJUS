const roleMiddleware = (role) => (req, res, next) => {
    if (req.user.user.role._id !== role) {
      return res.status(403).send("Access denied");
    }
    next();
  };
  
  module.exports = roleMiddleware;