const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists with absolute path
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Set storage engine with proper configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path for reliability
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed image extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Allowed mime types
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
}

// Init upload with enhanced security
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 4
  },
  fileFilter: function (req, file, cb) {
    console.log('File filter - Original name:', file.originalname);
    console.log('File filter - Mime type:', file.mimetype);
    checkFileType(file, cb);
  }
});

module.exports = upload;