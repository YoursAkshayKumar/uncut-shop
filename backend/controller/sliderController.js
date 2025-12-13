const Slider = require('../models/Slider');

// add a slider 
exports.addSlider = async (req, res, next) => {
  try {
    // Only backgroundImage is required - everything else is optional
    if (!req.body.backgroundImage || req.body.backgroundImage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Background image is required",
      });
    }

    // Prepare data - use defaults for empty optional fields
    const sliderData = {
      backgroundImage: req.body.backgroundImage.trim(),
      backgroundImageTablet: req.body.backgroundImageTablet && req.body.backgroundImageTablet.trim() !== "" ? req.body.backgroundImageTablet.trim() : "",
      backgroundImageMobile: req.body.backgroundImageMobile && req.body.backgroundImageMobile.trim() !== "" ? req.body.backgroundImageMobile.trim() : "",
      title: req.body.title && req.body.title.trim() !== "" ? req.body.title.trim() : "",
      preTitle: req.body.preTitle && req.body.preTitle.trim() !== "" ? req.body.preTitle.trim() : "",
      productImage: req.body.productImage && req.body.productImage.trim() !== "" ? req.body.productImage.trim() : "",
      buttonText: req.body.buttonText && req.body.buttonText.trim() !== "" ? req.body.buttonText.trim() : "Explore The Collection",
      buttonLink: req.body.buttonLink && req.body.buttonLink.trim() !== "" ? req.body.buttonLink.trim() : "/shop",
      order: req.body.order ? parseInt(req.body.order) : 0,
      status: req.body.status || "active",
    };
    
    const slider = new Slider(sliderData);
    const result = await slider.save();
    res.status(200).json({
      status: "success",
      message: "Slider created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// get all sliders
exports.getAllSliders = async (req, res, next) => {
  try {
    const result = await Slider.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
}

// get active sliders
exports.getActiveSliders = async (req, res, next) => {
  try {
    const result = await Slider.find({ status: "active" }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
}

// get single slider
exports.getSingleSlider = async (req, res, next) => {
  try {
    const result = await Slider.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
}

// update slider
exports.updateSlider = async (req, res, next) => {
  try {
    // Only backgroundImage is required - check if it exists in the update
    if (req.body.backgroundImage !== undefined && (!req.body.backgroundImage || req.body.backgroundImage.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Background image is required",
      });
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    if (req.body.backgroundImage !== undefined) {
      updateData.backgroundImage = req.body.backgroundImage.trim();
    }
    
    if (req.body.backgroundImageTablet !== undefined) {
      updateData.backgroundImageTablet = req.body.backgroundImageTablet && req.body.backgroundImageTablet.trim() !== "" ? req.body.backgroundImageTablet.trim() : "";
    }
    
    if (req.body.backgroundImageMobile !== undefined) {
      updateData.backgroundImageMobile = req.body.backgroundImageMobile && req.body.backgroundImageMobile.trim() !== "" ? req.body.backgroundImageMobile.trim() : "";
    }
    
    if (req.body.title !== undefined) {
      updateData.title = req.body.title && req.body.title.trim() !== "" ? req.body.title.trim() : "";
    }
    
    if (req.body.preTitle !== undefined) {
      updateData.preTitle = req.body.preTitle && req.body.preTitle.trim() !== "" ? req.body.preTitle.trim() : "";
    }
    
    if (req.body.productImage !== undefined) {
      updateData.productImage = req.body.productImage && req.body.productImage.trim() !== "" ? req.body.productImage.trim() : "";
    }
    
    if (req.body.buttonText !== undefined) {
      updateData.buttonText = req.body.buttonText && req.body.buttonText.trim() !== "" ? req.body.buttonText.trim() : "Explore The Collection";
    }
    
    if (req.body.buttonLink !== undefined) {
      updateData.buttonLink = req.body.buttonLink && req.body.buttonLink.trim() !== "" ? req.body.buttonLink.trim() : "/shop";
    }
    
    if (req.body.order !== undefined) {
      updateData.order = req.body.order ? parseInt(req.body.order) : 0;
    }
    
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }
    
    const result = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: false }
    );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }
    res.status(200).json({
      status: true,
      message: 'Slider updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// delete slider
exports.deleteSlider = async (req, res, next) => {
  try {
    const result = await Slider.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }
    res.status(200).json({
      success: true,
      message: 'Slider deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
