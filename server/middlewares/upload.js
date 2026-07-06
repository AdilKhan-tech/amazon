const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/");
        console.log("Upload destination:", uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        console.log("Upload filename:", filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        console.log("File filter - fieldname:", file.fieldname, "mimetype:", file.mimetype);
        cb(null, true);
    }
});

module.exports = upload;
