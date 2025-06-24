const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const QRCode = require('qrcode');

const router = express.Router();

/* ====== Directory setup - start ====== */
const baseUploadDir = path.join(__dirname, '../uploads/projects');
const baseMetadataDir = path.join(__dirname, '../metadata');

if (!fs.existsSync(baseUploadDir)) fs.mkdirSync(baseUploadDir, { recursive: true });
if (!fs.existsSync(baseMetadataDir)) fs.mkdirSync(baseMetadataDir, { recursive: true });
/* ====== Directory setup - end ====== */

/* ====== Multer config - start ====== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const project = req.body.project;
    if (!project || !/^[a-zA-Z0-9-_]+$/.test(project)) {
      return cb(new Error('Project not specified or invalid'), null);
    }
    const projectDir = path.join(baseUploadDir, project);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    cb(null, projectDir);
  },
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
    const { version, notes, project } = req.body;
    const file = req.file;

    if (!file || !project || !/^[a-zA-Z0-9-_]+$/.test(project)) {
      return res.status(400).json({ error: 'Missing or invalid file or project name.' });
    }

    const projectDir = path.join(baseUploadDir, project);
    const filePath = path.join(projectDir, file.filename);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/projects/${project}/${file.filename}`;
    const qrDataUrl = await QRCode.toDataURL(fileUrl);

    // Embed QR Code into PDF
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
    const metadataProjectDir = path.join(baseMetadataDir, project);
    if (!fs.existsSync(metadataProjectDir)) {
      fs.mkdirSync(metadataProjectDir, { recursive: true });
    }

    const metadata = {
      file: file.filename,
      originalName: file.originalname,
      version,
      notes,
      uploadAt: new Date().toISOString()
    };

    const metadataFilename = file.filename.replace(/\.pdf$/i, '.json');
    const metadataPath = path.join(metadataProjectDir, metadataFilename);
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

// Get project folders
router.get('/projects', (req, res) => {
  const projectsDir = path.join(__dirname, '../uploads/projects');

  fs.readdir(projectsDir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not list project folders' });

    const folders = files
      .filter(file => file.isDirectory())
      .map(dir => ({ id: dir.name, name: dir.name }));

    res.json(folders);
  });
});
/* ====== Upload endpoint - end ====== */

module.exports = router;
