const stripe = require("stripe")(
    "sk_test_51Npp1DAOgRJvP1tDlRDrCYvS9C0nzwWfNMREGLixHLQVKe8xj56QSsW0sYOaJwuY1ey6Op16jZB5JuDBdiBinl3v00iQy36avR"
  );
  const SubscriptionPlan = require("../models/SubscriptionPlan");
  const User = require("../models/User");
  
  const getSubscriptionPlansList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const paginationStatus = parseInt(req.query.paginationStatus) || 0;
  
      const startIndex = (page - 1) * limit;
  
      let subscriptionPlans;
      let pagination;
      const totalSubscriptionPlans = await SubscriptionPlan.countDocuments();
  
      if (paginationStatus && paginationStatus == 1) {
        subscriptionPlans = await SubscriptionPlan.find()
          .sort({ _id: -1 })
          .skip(startIndex)
          .limit(limit);
  
        pagination = {
          current_page: page,
          per_page: limit,
          total: totalSubscriptionPlans,
        };
      } else {
        subscriptionPlans = await SubscriptionPlan.find();
      }
  
      res.status(200).json({
        message: "Successfully Found Subscription Plans!",
        subscriptionPlans: subscriptionPlans,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "An error occurred while fetching sessions.",
        error: err.message,
      });
    }
  };
  
  const subscriptionPlanSelect = async (req, res) => {
    try {
      const { plan_id, user_id } = req.body;
      const plan = await SubscriptionPlan.findById(plan_id);
      const user = await User.findById(user_id).populate({
        path: "currentPlan",
      });
  
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
  
      if (plan.name === "Free") {
        if (user.currentPlan && user.currentPlan.name === "Free") {
          if (user.planExpiryDate && new Date(user.planExpiryDate) < new Date()) {
            return res.status(400).json({
              message:
                "You have already claimed the free plan, and plan is expired!.",
            });
          }
  
          return res.status(400).json({
            message: "You have already claimed the free plan!.",
          });
        } else {
          if (user?.hasUsedFreePlan === true) {
            return res.status(400).json({
              message: "You have already claimed the free plan!.",
            });
          }
        }
      }
  
      if (plan.name === "Basic" || plan.name === "Premium") {
        if (user.currentPlan && user.currentPlan.name === plan.name) {
          if (user.planExpiryDate && new Date(user.planExpiryDate) > new Date()) {
            return res.status(400).json({
              message: `You already have an active ${plan.name} plan. You can buy a new plan after the current one expires.`,
            });
          }
        }
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "pkr",
              product_data: {
                name: plan.name,
              },
              unit_amount: plan.price * 100,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan_id}`,
        cancel_url: `http://localhost:3000/payment-failure`,
      });
  
      user.stripeSessionId = session.id;
      await user.save();
  
      return res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "An error occurred while fetching sessions.",
        error: err.message,
      });
    }
  };
  
  const verifyPayment = async (req, res) => {
    const { sessionId, planId } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session && session.payment_status === "paid") {
        const user = await User.findOne({ stripeSessionId: sessionId });
  
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
  
        const plan = await SubscriptionPlan.findById(planId);
  
        if (plan && user) {
          user.currentPlan = planId;
          user.planExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          user.paymentStatus = "Completed";
          user.stripeSessionId = "";
          await user.save();
  
          return res.status(200).json({ success: true });
        }
  
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }
  
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
  
  module.exports = {
    getSubscriptionPlansList,
    subscriptionPlanSelect,
    verifyPayment,
  };