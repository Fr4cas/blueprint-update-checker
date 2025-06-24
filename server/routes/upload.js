const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const QRCode = require('qrcode');

const router = express.Router();

/* ====== Directory setup - start ====== */
const uploadDir = path.join(__dirname, '../uploads');
const metadataDir = path.join(__dirname, '../metadata');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir);
/* ====== Directory setup - end ====== */

/* ====== Multer config - start ====== */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const uniqueName = `${timestamp}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
/* ====== Multer config - end ====== */

/* ====== Upload endpoint - start ====== */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { version, notes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = path.join(uploadDir, file.filename);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    const qrDataUrl = await QRCode.toDataURL(fileUrl);

    // Load and embed QR into PDF
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(qrDataUrl);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    page.drawImage(pngImage, {
      x: width - 100,
      y: 50,
      width: 80,
      height: 80
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, modifiedPdfBytes);

    // Save metadata
    const metadata = {
      file: file.filename,
      originalName: file.originalname,
      version,
      notes,
      uploadAt: new Date().toISOString()
    };

    const metadataFilename = file.filename.replace(/\.pdf$/i, '.json');
    const metadataPath = path.join(metadataDir, metadataFilename);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    res.json({
      status: 'success',
      fileUrl,
      ...metadata
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ status: 'error', message: 'Server error during upload.' });
  }
});
/* ====== Upload endpoint - end ====== */

module.exports = router;