const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const AdminSettings = sequelize.define("AdminSettings", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // Store Settings
    storeName: {
        type: DataTypes.STRING,
        defaultValue: "Amazon Store"
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "USD"
    },
    timezone: {
        type: DataTypes.STRING,
        defaultValue: "America/New_York"
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: "en"
    },
    // Notification Settings
    notifyNewOrders: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        get() {
            return Boolean(this.getDataValue("notifyNewOrders"));
        }
    },
    notifyLowStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        get() {
            return Boolean(this.getDataValue("notifyLowStock"));
        }
    },
    notifyNewUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        get() {
            return Boolean(this.getDataValue("notifyNewUsers"));
        }
    },
    notifyReviews: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        get() {
            return Boolean(this.getDataValue("notifyReviews"));
        }
    },
    // Security Settings
    twoFactor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        get() {
            return Boolean(this.getDataValue("twoFactor"));
        }
    },
    loginAlerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        get() {
            return Boolean(this.getDataValue("loginAlerts"));
        }
    },
    sessionTimeout: {
        type: DataTypes.STRING,
        defaultValue: "30"
    },
    // Profile Settings
    profileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true });

module.exports = AdminSettings;
