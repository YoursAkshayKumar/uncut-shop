const express = require("express");
const {
  paymentIntent,
  verifyPayment,
  addOrder,
  getSingleOrder,
  updateOrderStatus,
  getOrders,
} = require("../controller/orderController");

// router
const router = express.Router();

// get orders
router.get("/orders", getOrders);
// add a create payment intent (Razorpay order)
router.post("/create-payment-intent", paymentIntent);
// verify Razorpay payment
router.post("/verify-payment", verifyPayment);
router.post("/addOrder", addOrder);
// single order
router.get("/:id", getSingleOrder);

// update status
router.patch("/update-status/:id", updateOrderStatus);

module.exports = router;
