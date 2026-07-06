const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/AddressController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", AddressController.getAll);
router.post("/", AddressController.create);
router.put("/:id", AddressController.update);
router.delete("/:id", AddressController.delete);
router.put("/:id/default", AddressController.setDefault);

module.exports = router;
