const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Review = sequelize.define(
    "Review",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Products",
                key: "id",
            },
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        helpful: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Review;