const { Cart, CartItem, Product, Category } = require("../models");

// Get cart for user
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product, include: [{ model: Category }] }],
      }],
    });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock." });

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity });
    }
    res.json({ message: "Added to cart.", item });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Cart item not found." });
    if (quantity < 1) {
      await item.destroy();
      return res.json({ message: "Item removed." });
    }
    item.quantity = quantity;
    await item.save();
    res.json({ message: "Cart updated.", item });
  } catch (error) {
    next(error);
  }
};

// Remove from cart
exports.removeItem = async (req, res, next) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Cart item not found." });
    await item.destroy();
    res.json({ message: "Item removed." });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ error: "Cart not found." });
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: "Cart cleared." });
  } catch (error) {
    next(error);
  }
};
