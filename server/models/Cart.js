const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Cart = sequelize.define("Cart", {
    id: {
         type: DataTypes.INTEGER,
          autoIncrement: true,
           primaryKey: true 
        },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "Users", key: "id" },
    },
}, { timestamps: true });

module.exports = Cart;
