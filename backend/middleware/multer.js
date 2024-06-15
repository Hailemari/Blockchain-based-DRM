const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
      cb(new Error("PNG and JPG images are allowed"));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;