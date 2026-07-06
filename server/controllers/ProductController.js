const { Product, Category, Review } = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Get all products with filters
exports.getAll = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, rating, search, sort, featured, page = 1, limit = 20 } = req.query;
    const where = {};

    if (category) {
      const cat = await Category.findOne({ where: { slug: category }, attributes: ['id'] });
      if (cat) where.categoryId = cat.id;
    }
    if (brand) where.brand = brand;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (rating) where.rating = { [Op.gte]: parseFloat(rating) };
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (featured === "true") where.featured = true;

    let order = [["createdAt", "DESC"]];
    if (sort === "price-low") order = [["price", "ASC"]];
    if (sort === "price-high") order = [["price", "DESC"]];
    if (sort === "rating") order = [["rating", "DESC"]];
    if (sort === "newest") order = [["createdAt", "DESC"]];
    if (sort === "best-selling") order = [["reviewCount", "DESC"]];

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: products, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ["name", "slug"] }],
      order,
      limit: Math.min(parseInt(limit), 100), // Cap at 100
      offset,
      attributes: ['id', 'name', 'slug', 'price', 'originalPrice', 'images', 'rating', 'reviewCount', 'brand', 'stock', 'featured', 'categoryId', 'createdAt'],
    });

    res.json({
      products,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by slug
exports.getBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: Category, attributes: ["name", "slug"] },
        { model: Review, include: [{ model: require("../models").User, attributes: ["id", "name"] }] },
      ],
    });
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Related products
    const related = await Product.findAll({
      where: { categoryId: product.categoryId, id: { [Op.ne]: product.id } },
      limit: 6,
    });

    res.json({ product, related });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID (admin)
exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["name", "slug"] }],
    });
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

// Create product (admin)
exports.create = async (req, res, next) => {
  try {
    const { name, description, price, originalPrice, images, categoryId, brand, stock, specs, featured } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const product = await Product.create({
      name, slug, description, price, originalPrice, images: images || [], categoryId, brand, stock: stock || 0, specs, featured: featured || false,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product (admin)
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    const { name, description, price, originalPrice, images, categoryId, brand, stock, specs, featured } = req.body;
    if (name) {
      product.name = name;
      product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (images) product.images = images;
    if (categoryId) product.categoryId = categoryId;
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (specs) product.specs = specs;
    if (featured !== undefined) product.featured = featured;
    await product.save();
    res.json({ message: "Product updated.", product });
  } catch (error) {
    next(error);
  }
};

// Delete product (admin)
exports.delete = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    await product.destroy();
    res.json({ message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};

// Upload product image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    next(error);
  }
};

// Get deals (products with discount > 30%)
exports.getDeals = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        originalPrice: { [Op.not]: null },
      },
      include: [{ model: Category, attributes: ["name", "slug"] }],
      attributes: ['id', 'name', 'slug', 'price', 'originalPrice', 'images', 'rating', 'reviewCount', 'brand', 'stock', 'categoryId'],
    });
    const deals = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) > 0.3);
    res.json(deals);
  } catch (error) {
    next(error);
  }
};
