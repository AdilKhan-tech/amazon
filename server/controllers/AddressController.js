const { Address } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [["isDefault", "DESC"]] });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { label, fullName, phone, address, city, state, zip, country, isDefault } = req.body;
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }
    const addr = await Address.create({ userId: req.user.id, label, fullName, phone, address, city, state, zip, country, isDefault });
    res.status(201).json(addr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ error: "Address not found." });
    const { label, fullName, phone, address, city, state, zip, country, isDefault } = req.body;
    if (isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    Object.assign(addr, { label, fullName, phone, address, city, state, zip, country, isDefault });
    await addr.save();
    res.json({ message: "Address updated.", address: addr });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ error: "Address not found." });
    await addr.destroy();
    res.json({ message: "Address deleted." });
  } catch (error) {
    next(error);
  }
};

exports.setDefault = async (req, res, next) => {
  try {
    await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ error: "Address not found." });
    addr.isDefault = true;
    await addr.save();
    res.json({ message: "Default address set." });
  } catch (error) {
    next(error);
  }
};
