const express = require('express');
const router = express.Router();
// internal
const sliderController = require('../controller/sliderController');

// add Slider
router.post('/add', sliderController.addSlider);
// get all Sliders
router.get('/all', sliderController.getAllSliders);
// get Active Sliders
router.get('/active', sliderController.getActiveSliders);
// get single Slider
router.get('/get/:id', sliderController.getSingleSlider);
// update Slider
router.patch('/edit/:id', sliderController.updateSlider);
// delete Slider
router.delete('/delete/:id', sliderController.deleteSlider);

module.exports = router;

