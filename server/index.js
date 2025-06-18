// Server index.js

// Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');

// Initialize app
const app = express();
const PORT = 5000;
const router = express.Router

// Handles requests
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ====== Data saving path and name - start ====== */
// Create _dir if not exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: uploadDir, // Save uploaded files to /uploads
  filename: (req, file, cb) => {
    const now = new Date();
  // Time + file name = new name
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  const uniqueName = `${timestamp}_${file.originalname}`;
  cb(null, uniqueName);
  },
});

const upload = multer({ storage });
/* ====== Data saving path and name - end ====== */

/* ====== Handle file upload + Save metadata - start ====== */
const metadataDir = path.join(__dirname, 'metadata');
if(!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir);

app.post('/upload', upload.single('file'), (req, res) => {
  const { version, notes } = req.body;
  const file = req.file;

  // Respond with error if user doesn't upload file
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Generate URL to access the uploaded file with QR code later
  const fileUrl = `http://localhost:${PORT}/uploads/${file.filename}`;

  // Metadata object
  const metadata = {
    file: file.filename,
    originalName: file.originalname,
    version,
    notes,
    uploadAt: new Date().toISOString()
  };

  // Save metadata JSON file
  const metadataFilename = file.filename.replace(/\.pdf$/i, '.json');
  const metadataPath = path.join(metadataDir, metadataFilename);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  // Send success response
  res.json({
    status: 'success',
    fileUrl,
    ...metadata
  });
});
/* ====== Handle file upload + Save metadata- end ======*/

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});