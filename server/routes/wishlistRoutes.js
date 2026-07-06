const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/WishlistController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", WishlistController.getAll);
router.post("/toggle", WishlistController.toggle);
router.delete("/:id", WishlistController.remove);

module.exports = router;
