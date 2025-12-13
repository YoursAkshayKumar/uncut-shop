const express = require('express');
const router = express.Router();
// internal
const subscriptionController = require('../controller/subscriptionController');

// add subscription
router.post('/add', subscriptionController.addSubscription);
// get all subscriptions
router.get('/all', subscriptionController.getAllSubscriptions);
// get single subscription
router.get('/get/:id', subscriptionController.getSingleSubscription);
// delete subscription
router.delete('/delete/:id', subscriptionController.deleteSubscription);
// update subscription status
router.patch('/update-status/:id', subscriptionController.updateSubscriptionStatus);

module.exports = router;
