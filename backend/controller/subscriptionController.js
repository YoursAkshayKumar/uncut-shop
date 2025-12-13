const Subscription = require('../models/Subscription');

// add subscription
exports.addSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email: email.toLowerCase().trim() });
    
    if (existingSubscription) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed!",
        data: existingSubscription,
      });
    }

    const subscription = new Subscription({
      email: email.toLowerCase().trim(),
      status: "active",
    });

    const result = await subscription.save();
    
    res.status(201).json({
      success: true,
      message: "Successfully subscribed!",
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(200).json({
        success: true,
        message: "You are already subscribed!",
      });
    }
    next(error);
  }
};

// get all subscriptions
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const result = await Subscription.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// get single subscription
exports.getSingleSubscription = async (req, res, next) => {
  try {
    const result = await Subscription.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// delete subscription
exports.deleteSubscription = async (req, res, next) => {
  try {
    const result = await Subscription.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// update subscription status (unsubscribe)
exports.updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: status || "unsubscribed" },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: 'Subscription status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
