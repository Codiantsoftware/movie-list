import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory
const uploadDir = "public/uploads/";

// Ensure the directory exists or create it if it does not
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory and any necessary parent directories
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files in the public/uploads/ directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

export default upload;
