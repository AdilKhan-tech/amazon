const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "English name is required" },
      len: {
        args: [2, 100],
        msg: "English name must be between 2 and 100 characters",
      },
    },
  },

  name_ar: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name english is required" },
      len: {
        args: [2, 100],
        msg: "Name arabic must be betwwen 2 and 100 characters",
      },
    },
  },
  
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        msg: "Slug must contain only lowercase later, number and hyphens",
      },
      len: {
        args: [2, 100],
        msg: "Slug must be between 2 and 100 characters",
      },
    },
  },

  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "categories",
      key: "id",
    },
    onDelete: "SET NULL",
  },

  display_type: {
    type: DataTypes.ENUM("Default", "Products", "Subcategories", "Both"),
    allowNull: true,
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
  tableName: "categories",
  timestamps: false,
}
);

module.exports = Category;
