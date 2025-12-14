const mongoose = require('mongoose');
const valid = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required:true,
    trim: true,
  },
  parent:{
    type:String,
    required: true,
    trim:true,
  },
  children:{
    type:String,
    required: true,
    trim:true,
  },
  tags: [String],
  image:{
    type:String,
    required: true,
    validate: [valid.isURL, "wrong url"]
  },
  originalPrice: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Price can't be negative"],
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  relatedImages: [{
    type: String,
    required: false,
    validate: [valid.isURL, "wrong url"]
  }],
  video: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return valid.isURL(v);
      },
      message: "Video must be a valid URL"
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: ObjectId,
      ref: "Brand",
      required: true,
    }
  },
  category: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: ObjectId,
      ref: "Category",
      required: true,
    }
  },
  unit: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  colors:[String],
  type:{
    type: String,
    default: "Cloth"
  },
  itemInfo: {
    type: String,
    default: "latest-product"
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inActive'],
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
},{
  timestamps: true
})

const Product = mongoose.model('Products',productSchema);
module.exports = Product;