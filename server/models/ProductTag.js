const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductTag = sequelize.define("ProductTag",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
},{
    tableName: "product_tags",
    timestamps: false,
  }
);

module.exports = ProductTag;
