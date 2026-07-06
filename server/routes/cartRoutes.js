const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/item/:itemId", CartController.updateItem);
router.delete("/item/:itemId", CartController.removeItem);
router.delete("/clear", CartController.clearCart);

module.exports = router;
