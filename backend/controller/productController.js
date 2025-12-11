const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const ApiError = require("../errors/api-error");
const makeSlug = (text = "") =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildBaseSlug = (title, sku) => {
  const base = makeSlug(title);
  if (sku) {
    return makeSlug(`${title}-${sku}`);
  }
  return base || "product";
};

const ensureUniqueSlug = async (baseSlug) => {
  let candidate = baseSlug || "product";
  let suffix = 0;
  // try a few suffixes to avoid collisions without leaking ids
  while (await Product.exists({ slug: candidate })) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
  return candidate;
};

// addAllProducts
module.exports.addProduct = async (req, res, next) => {
  try {
    const imageURLs = [req.body.image, ...req.body.relatedImages];
    const baseSlug = buildBaseSlug(req.body.title, req.body.sku);
    const slug = await ensureUniqueSlug(baseSlug);
    const newProduct = new Product({
      ...req.body,
      relatedImages: imageURLs,
      slug,
    });
    await newProduct.save();
    const { _id: productId, brand, category } = newProduct;
    //update Brand
    await Brand.updateOne(
      { _id: brand.id },
      { $push: { products: productId } }
    );
    //Category update
    await Category.updateOne(
      { _id: category.id },
      { $push: { products: productId } }
    );

    res.send({
      message: "Product added successfully",
    });
  } catch (err) {
    next(err);
  }
};
// addAllProducts
module.exports.addAllProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    const productsWithSlugs = [];
    for (const product of req.body) {
      const baseSlug = buildBaseSlug(product.title, product.sku);
      const slug = await ensureUniqueSlug(baseSlug);
      productsWithSlugs.push({
        ...product,
        slug,
      });
    }
    const result = await Product.insertMany(productsWithSlugs);
    res.send({
      message: "Products added successfully",
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all show products
module.exports.getShowingProducts = async (req, res, next) => {
  try {
    const result = await Product.find({ status: "active" });
    res.json({
      success: true,
      products: result,
    });
  } catch (error) {
    next(error);
  }
};

// get all products
module.exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await Product.find({});
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// getDiscountProduct
module.exports.getDiscountProduct = async (req, res, next) => {
  try {
    const discountProducts = await Product.find({ discount: { $gt: 0 } });
    res.json({
      success: true,
      products: discountProducts,
    });
  } catch (err) {
    next(err);
  }
};

// getDiscountProduct
module.exports.getSingleProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug });

    if (!product) {
      // fallback to object id for backward compatibility
      try {
        product = await Product.findById(slug);
      } catch (_) {
        product = null;
      }
    }

    if (!product) {
      // last-resort: match computed slug from title for legacy documents
      const candidates = await Product.find({})
        .select("_id title slug")
        .lean();
      const match = candidates.find(
        (item) => item && makeSlug(item.title) === slug
      );
      if (match) {
        product = await Product.findById(match._id);
        if (product && !product.slug) {
          const newSlug = await ensureUniqueSlug(makeSlug(product.title));
          product.slug = newSlug;
          await product.save();
        }
      }
    }

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// get related products
module.exports.getRelatedProducts = async (req, res, next) => {
  const { tags } = req.query;
  const queryTags = tags?.split(",");
  try {
    const product = await Product.find({ tags: { $in: queryTags } }).limit(4);
    res.status(200).json({
      status: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// update product
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const isExist = await Product.findOne({ _id: req.params.id });

    if (!isExist) {
      throw new ApiError(404, "Product not found !");
    }

    let nextSlug = req.body.slug;
    if (!nextSlug && req.body.title) {
      const baseSlug = buildBaseSlug(
        req.body.title,
        req.body.sku || isExist.sku
      );
      nextSlug = await ensureUniqueSlug(baseSlug);
    }

    const result = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        ...(nextSlug ? { slug: nextSlug } : {}),
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
