// Server index.js

// Required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
require('dotenv').config();

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

/* ====== Handle file upload + Save metadata + QR embed - start ====== */
app.post('/upload', upload.single('file'), async (req, res) => {
  const { version, notes } = req.body;
  const file = req.file;

  // Respond with error if user doesn't upload file
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Generate URL to access the uploaded file with QR code later
  const filePath = path.join(uploadDir, file.filename);
  const fileUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
  const qrDataUrl = await QRCode.toDataURL(fileUrl);

  /* ====== Load PDF and embed QR section - start */
  const existingPdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pngImage = await pdfDoc.embedPng(qrDataUrl);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  // Code position
  const qrSize = 100;
  page.drawImage(pngImage, {
    x: width - qrSize - 50,
    y: 50,
    width: qrSize,
    height: qrSize
  });

  // Save updated Pdf
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, modifiedPdfBytes);

  /* ====== Load PDF and embed QR section - end */

  /* ====== Metadata section - start */
  const metadataDir = path.join(__dirname, 'metadata');
  if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir);

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
  /* ====== Metadata section - start */
});

/* ====== Handle file upload + Save metadata - end ======*/

/* ====== API access - start ======*/
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.post('/auth/token', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: ' Authorization code missing ' });
  };

  // Route to exchange code for token
  const response = await fetch('https://id.trimble.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost',
      client_id: process.env.TRIMBLE_CLIENT_ID,
      client_secret: process.env.TRIMBLE_CLIENT_SECRET,
    }),
  });

  const data = await response.json();
  if (data.error) {
    return res.status(400).json({ error: data.error, description: data.error_description });
  }

  res.json(data);
});

// Get route for browser/ debugging
app.get('/auth/token', (req, res) => {
  res.send('This route only supports POST. Please send a POST request with a code in the body.');
});
/* ====== API access - end ======*/

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});