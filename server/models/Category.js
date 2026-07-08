const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.STRING, allowNull: true },
  parentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Categories", key: "id" } },
}, { timestamps: true });

module.exports = Category;
