const multer = require('multer');
const config = require('../../config/configMulter');
const path = require('path');
const user = require('../database/models/user');
db = require('../database/models');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = config.uploadDirectory;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`); 
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File must be an image'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.maxFileSize
  }
});

const uploadMiddleware = (req, res, next) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    next(); // Panggil next setelah upload selesai
  });
};

module.exports = uploadMiddleware;
