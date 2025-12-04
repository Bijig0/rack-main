const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../public/image");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/**
 * Middleware for handling file uploads (local storage)
 * @param {string} fieldName - Form field name
 * @param {boolean} multiple - Set `true` for multiple file uploads
 */
const fileUpload = (fieldName, multiple = false) => {
  return (req, res, next) => {
    const multerUpload = multiple
      ? upload.array(fieldName)
      : upload.single(fieldName);

    multerUpload(req, res, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message,
        });
      }

      try {
        if (multiple) {
          if (!req.files || req.files.length === 0) return next();

          const uploadedFiles = req.files.map(
            (file) => `image/${file.filename}`
          );

          req.uploadedFiles = uploadedFiles;
          req.body[fieldName] = uploadedFiles;
        } else {
          if (!req.file) return next();

          const uploadedFile = `image/${req.file.filename}`;

          req.uploadedFiles = uploadedFile;
          req.body[fieldName] = uploadedFile;
        }

        next();
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message });
      }
    });
  };
};

module.exports = fileUpload;
