const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const CartItem = sequelize.define("CartItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Carts", key: "id" }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Products", key: "id" }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
}, { timestamps: true });

module.exports = CartItem;
