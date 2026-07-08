const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Wishlist = sequelize.define("Wishlist",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Products",
                key: "id"
            }
        },
    }, { timestamps: true });

module.exports = Wishlist;
