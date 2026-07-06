const { Wishlist, Product, Category } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const items = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, include: [{ model: Category }] }],
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.toggle = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const existing = await Wishlist.findOne({ where: { userId: req.user.id, productId } });
    if (existing) {
      await existing.destroy();
      return res.json({ message: "Removed from wishlist.", inWishlist: false });
    }
    await Wishlist.create({ userId: req.user.id, productId });
    res.json({ message: "Added to wishlist.", inWishlist: true });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Wishlist.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ error: "Item not found." });
    await item.destroy();
    res.json({ message: "Removed from wishlist." });
  } catch (error) {
    next(error);
  }
};
