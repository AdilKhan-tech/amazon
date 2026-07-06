const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", ProductController.getAll);
router.get("/deals", ProductController.getDeals);
router.get("/by-id/:id", ProductController.getById);
router.get("/:slug", ProductController.getBySlug);
router.post("/", authMiddleware, adminMiddleware, ProductController.create);
router.put("/:id", authMiddleware, adminMiddleware, ProductController.update);
router.delete("/:id", authMiddleware, adminMiddleware, ProductController.delete);
router.post("/upload-image", authMiddleware, adminMiddleware, upload.single("image"), ProductController.uploadImage);

module.exports = router;
