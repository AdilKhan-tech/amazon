const { Order, OrderItem, Product, User, Cart, CartItem, Coupon } = require("../models");

// Generate order number
const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ORD-${date}-${rand}`;
};

// Create order
exports.create = async (req, res, next) => {
  try {
    const { shippingAddress, shippingMethod, shippingCost, paymentMethod, promoCode } = req.body;
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [{ model: Product }] }],
    });
    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    let discount = 0;
    if (promoCode) {
      const coupon = await Coupon.findOne({ where: { code: promoCode, active: true } });
      if (coupon) {
        if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: "Coupon usage limit reached." });
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: "Coupon expired." });
        const subtotal = cart.CartItems.reduce((sum, i) => sum + i.Product.price * i.quantity, 0);
        if (subtotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order $${coupon.minOrder} required.` });
        discount = coupon.discountType === "percentage" ? (subtotal * coupon.discountValue / 100) : coupon.discountValue;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const subtotal = cart.CartItems.reduce((sum, i) => sum + i.Product.price * i.quantity, 0);
    const tax = (subtotal - discount) * 0.08;
    const totalAmount = subtotal - discount + (shippingCost || 0) + tax;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      shippingMethod: shippingMethod || "standard",
      shippingCost: shippingCost || 0,
      tax,
      paymentMethod: paymentMethod || "card",
      promoCode,
      discount,
    });

    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      });
      // Decrease stock
      await Product.decrement("stock", { by: item.quantity, where: { id: item.productId } });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ message: "Order placed.", order });
  } catch (error) {
    next(error);
  }
};

// Get user orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [{ model: Product }] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: OrderItem, include: [{ model: Product }] }],
    });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== "All") where.status = status;
    const orders = await Order.findAll({
      where,
      include: [{ model: User, attributes: ["id", "name", "email"] }, { model: OrderItem, include: [{ model: Product }] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Update order status (admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated.", order });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats (admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = (await Order.sum("totalAmount")) || 0;
    const totalProducts = await Product.count();
    const totalCustomers = await User.count({ where: { role: "user" } });
    const recentOrders = await Order.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
    res.json({ totalOrders, totalRevenue, totalProducts, totalCustomers, recentOrders });
  } catch (error) {
    next(error);
  }
};
