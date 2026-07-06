const { Category, Product } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ include: [{ model: Product, attributes: ["id"] }] });
    const result = categories.map((c) => ({
      ...c.toJSON(),
      productCount: c.Products ? c.Products.length : 0,
      Products: undefined,
    }));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Product }],
    });
    if (!category) return res.status(404).json({ error: "Category not found." });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, image, parentId } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await Category.create({ name, slug, image, parentId });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found." });
    const { name, image, parentId } = req.body;
    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (image !== undefined) category.image = image;
    if (parentId !== undefined) category.parentId = parentId;
    await category.save();
    res.json({ message: "Category updated.", category });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found." });
    await category.destroy();
    res.json({ message: "Category deleted." });
  } catch (error) {
    next(error);
  }
};
