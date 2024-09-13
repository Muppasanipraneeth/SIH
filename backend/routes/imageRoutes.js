const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Specify the directory for uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Use the original file name
  }
});

const upload = multer({ storage: storage });

// POST route for uploading the image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Simulate processing the image (replace this with your ML logic)
  const extractedAddress = "123 Main St, City, Country"; // Placeholder address

  res.status(200).json({ address: extractedAddress });
});

module.exports = router;
