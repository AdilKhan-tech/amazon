const express = require("express");
const router = express.Router();
const SettingsController = require("../controllers/SettingsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// All settings routes require admin auth
router.use(authMiddleware);

router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);
router.delete("/reset", SettingsController.resetSettings);

module.exports = router;
