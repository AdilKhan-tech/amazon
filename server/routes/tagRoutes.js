const express = require("express");
const router = express.Router();
const TagController = require('../controllers/TagController');
const authenticateToken = require("../middlewares/authenticateToken");

router.use(authenticateToken);
const upload = require("../middlewares/upload");

router.post('/create', upload.single('image_url'), TagController.createTag);
router.get('/', TagController.getAllTags)
router.put('/update/:id', upload.single("image_url"), TagController.updateTagById);
router.delete('/delete/:id', TagController.deleteTagById);

module.exports = router;