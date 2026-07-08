const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Categories", key: "id" } },
  brand: { type: DataTypes.STRING, allowNull: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  specs: { type: DataTypes.JSON, allowNull: true },
}, { timestamps: true });

module.exports = Product;
