const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gender = sequelize.define('Gender', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[a-z0-9-]+$/i,
        msg: "Slug must contain only letters, numbers and hyphens",
      },
    },
  },
  parent_gender: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: 'genders',
  timestamps: false,
});

module.exports = Gender;
