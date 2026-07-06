const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/product/:productId", ReviewController.getByProduct);
router.post("/", authMiddleware, ReviewController.create);
router.post("/:id/helpful", ReviewController.helpful);
router.delete("/:id", authMiddleware, ReviewController.delete);

module.exports = router;
