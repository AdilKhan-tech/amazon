const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authMiddleware, AuthController.getProfile);
router.put("/profile", authMiddleware, upload.single("image"), AuthController.updateProfile);
router.put("/change-password", authMiddleware, AuthController.changePassword);
router.get("/users", authMiddleware, AuthController.getUsers);
router.put("/users/:id", authMiddleware, AuthController.updateUser);
router.delete("/users/:id", authMiddleware, AuthController.deleteUser);

module.exports = router;
