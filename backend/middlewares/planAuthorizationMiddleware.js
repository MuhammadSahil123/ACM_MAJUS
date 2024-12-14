const planAuthorizationMiddleware = (allowedPlans) => {
    return (req, res, next) => {
      const userPlan = req.user?.user?.currentPlan;
      if (!userPlan || !allowedPlans.includes(userPlan.name)) {
        return res.status(403).json({
          message:
            "You do not have access to this workout routine. Please *UPGRADE* your plan.",
        });
      }
  
      next();
    };
  };
  
  module.exports = planAuthorizationMiddleware;