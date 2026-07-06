const { Coupon } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({ order: [["createdAt", "DESC"]] });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrder, maxUses, expiresAt } = req.body;
    const coupon = await Coupon.create({ code: code.toUpperCase(), discountType, discountValue, minOrder, maxUses, expiresAt });
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    const { code, discountType, discountValue, minOrder, maxUses, expiresAt, active } = req.body;
    if (code) coupon.code = code.toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountValue) coupon.discountValue = discountValue;
    if (minOrder !== undefined) coupon.minOrder = minOrder;
    if (maxUses !== undefined) coupon.maxUses = maxUses;
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt;
    if (active !== undefined) coupon.active = active;
    await coupon.save();
    res.json({ message: "Coupon updated.", coupon });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    await coupon.destroy();
    res.json({ message: "Coupon deleted." });
  } catch (error) {
    next(error);
  }
};

// Validate coupon (for checkout)
exports.validate = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), active: true } });
    if (!coupon) return res.status(404).json({ error: "Invalid coupon code." });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: "Coupon usage limit reached." });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: "Coupon expired." });
    res.json({ valid: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, minOrder: coupon.minOrder } });
  } catch (error) {
    next(error);
  }
};
