const { AdminSettings } = require("../models");

// Boolean fields that need 0/1 to true/false conversion
const BOOL_FIELDS = ["notifyNewOrders", "notifyLowStock", "notifyNewUsers", "notifyReviews", "twoFactor", "loginAlerts"];

// Convert 0/1 to proper booleans
const formatSettings = (s) => {
    const obj = s.toJSON();
    BOOL_FIELDS.forEach(field => {
        if (obj[field] !== undefined && obj[field] !== null) {
            obj[field] = Boolean(obj[field]);
        }
    });
    return obj;
};

// Default settings
const DEFAULT_SETTINGS = {
    storeName: "Amazon Store",
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyNewUsers: false,
    notifyReviews: true,
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    profileName: null,
    profilePhone: null,
};

// Get all settings (single row)
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await AdminSettings.create(DEFAULT_SETTINGS);
        }
        res.json({ settings: formatSettings(settings) });
    } catch (error) {
        next(error);
    }
};

// Update settings
exports.updateSettings = async (req, res, next) => {
    try {
        const updates = req.body;
        
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = await AdminSettings.create({ ...DEFAULT_SETTINGS, ...updates });
        } else {
            await settings.update(updates);
        }

        res.json({ 
            message: "Settings updated successfully",
            settings: formatSettings(settings) 
        });
    } catch (error) {
        next(error);
    }
};

// Reset all settings to default
exports.resetSettings = async (req, res, next) => {
    try {
        await AdminSettings.destroy({ where: {} });
        const settings = await AdminSettings.create(DEFAULT_SETTINGS);

        res.json({ 
            message: "Settings reset to default",
            settings: formatSettings(settings) 
        });
    } catch (error) {
        next(error);
    }
};
