const { secret } = require("../config/secret");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: secret.razorpay_key_id,
  key_secret: secret.razorpay_key_secret,
});

// create-order (Razorpay equivalent of payment intent)
module.exports.paymentIntent = async (req, res) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100; // Razorpay expects amount in paise (smallest currency unit)
    
    // Create a Razorpay order
    const options = {
      amount: amount,
      currency: "INR", // Change to USD if needed, but Razorpay primarily supports INR
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    res.status(200).send({
      success: true,
      orderId: razorpayOrder.id,
      order_id: razorpayOrder.id, // Alternative key for compatibility
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Failed to create payment order",
      message: error.message,
    });
  }
};
// verify-payment
module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", secret.razorpay_key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).send({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

module.exports.addOrder = async (req, res) => {
  try {
    const orderItems = req.body;
    const newOrders = new Order(orderItems);
    const order = await newOrders.save();

    res.status(200).send({
      success: true,
      message: "Order added successfully",
      order: order,
    });
  } catch (error) {
    console.log(error);
  }
};

// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// updateOrderStatus
exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  console.log('newStatus',newStatus)
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      }, { new: true })
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).sort({ createdAt: -1 }).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};