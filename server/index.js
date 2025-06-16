// Server index.js

// Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize app
const app = express();
const PORT = 5000;

// Handles requests
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: uploadDir, // Save uploaded files to /uploads
  filename: (req, file, cb) => {
    const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const uniqueName = `${timestamp}_${file.originalname}`;
  cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const { version, notes } = req.body;
  const file = req.file;

  // If no file was uploaded, respond with error
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Generate URL to access the uploaded file
  const fileUrl = `http://localhost:${PORT}/uploads/${file.filename}`;

  // Send success response with file info and metadata
  res.json({
    status: 'success',
    fileUrl,
    fileName: file.originalname,
    savedAs: file.filename,
    version,
    notes,
  });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});