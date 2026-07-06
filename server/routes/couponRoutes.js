const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/CouponController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, adminMiddleware, CouponController.getAll);
router.post("/", authMiddleware, adminMiddleware, CouponController.create);
router.post("/validate", CouponController.validate);
router.put("/:id", authMiddleware, adminMiddleware, CouponController.update);
router.delete("/:id", authMiddleware, adminMiddleware, CouponController.delete);

module.exports = router;
