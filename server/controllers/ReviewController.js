const { Review, Product, User } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const existing = await Review.findOne({ where: { productId, userId: req.user.id } });
    if (existing) return res.status(400).json({ error: "You already reviewed this product." });

    const review = await Review.create({ productId, userId: req.user.id, rating, title, comment, verified: true });

    // Update product rating
    const reviews = await Review.findAll({ where: { productId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.update({ rating: avgRating, reviewCount: reviews.length }, { where: { id: productId } });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ["id", "name", "image"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.helpful = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });
    review.helpful += 1;
    await review.save();
    res.json({ helpful: review.helpful });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });
    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized." });
    }
    await review.destroy();
    res.json({ message: "Review deleted." });
  } catch (error) {
    next(error);
  }
};
