const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "id" }
    },
    productId: {
        type: DataTypes.INTEGER,
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    },
}, { timestamps: true });

module.exports = OrderItem;
