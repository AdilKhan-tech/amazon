const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomCakeFlavor = sequelize.define("CustomCakeFlavor",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(55),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name English is required" },
        len: {
          args: [2, 55],
          msg: "Name English must be between 2 and 55 characters",
        },
      },
    },
    name_ar: {
      type: DataTypes.STRING(55),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name Arabic is required" },
        len: {
          args: [2, 55],
          msg: "Name Arabic must be between 2 and 55 characters",
        },
      },
    },
    custom_cake_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Custom Cake Type is required" },
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Slug is required" },
        is: {
          args: /^[a-z0-9-]+$/i,
          msg: "Slug can contain only letters, numbers, and dashes",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Status must be active or inactive",
        },
      },
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "custom_cake_flavors",
    timestamps: false,
  }
);

module.exports = CustomCakeFlavor;
