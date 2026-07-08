const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Coupon = sequelize.define("Coupon", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    discountType: {
        type: DataTypes.ENUM("percentage", "fixed"),
        defaultValue: "percentage"
    },
    discountValue: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    minOrder: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    maxUses: {
        type: DataTypes.INTEGER,
        defaultValue: 1000
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Coupon;