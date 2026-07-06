const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, OrderController.create);
router.get("/my", authMiddleware, OrderController.getUserOrders);
router.get("/:id", authMiddleware, OrderController.getOrder);
router.get("/admin/all", authMiddleware, adminMiddleware, OrderController.getAllOrders);
router.put("/admin/:id/status", authMiddleware, adminMiddleware, OrderController.updateStatus);
router.get("/admin/stats", authMiddleware, adminMiddleware, OrderController.getStats);

module.exports = router;
