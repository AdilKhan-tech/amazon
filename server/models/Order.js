const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },

        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        shippingAddress: {
            type: DataTypes.JSON,
            allowNull: false,
        },

        shippingMethod: {
            type: DataTypes.STRING,
            defaultValue: "standard",
        },

        shippingCost: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },

        tax: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },

        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ),
            defaultValue: "pending",
        },

        promoCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        discount: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Order;