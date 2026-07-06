const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  name_ar: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  gender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  regular_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  sale_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  tax_status: {
    type: DataTypes.ENUM("Taxable", "Shipping Only", "None"),
    defaultValue: "Taxable"
  },

  tax_class: {
    type: DataTypes.ENUM("Standard", "Popular"),
    defaultValue: "Standard",
  },

  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  created_at:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  updated_at:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
