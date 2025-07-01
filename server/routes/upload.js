const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const os = require('os');
const { PDFDocument } = require('pdf-lib');

const router = express.Router();

/* ====== Get local IP for QR url - start ====== */
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
/* ====== Get local IP for QR url - end ====== */

/* ====== Directory setup - start ====== */
const baseUploadDir = path.join(__dirname, '../uploads/projects');

if (!fs.existsSync(baseUploadDir)) fs.mkdirSync(baseUploadDir, { recursive: true });
/* ====== Directory setup - end ====== */

/* ====== Multer config - start ====== */
const iconv = require('iconv-lite'); // decode for Chinese

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const project = req.body.project;
    if (!project || /[<>:"\/\\|?*\x00-\x1F]/.test(project.trim())) {
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

    // Fix encoding: convert ISO-8859-1 → UTF-8
    let properlyDecoded;
    try {
      const buffer = Buffer.from(file.originalname, 'latin1'); // interpret as ISO-8859-1
      properlyDecoded = buffer.toString('utf8');               // convert to UTF-8
    } catch {
      properlyDecoded = file.originalname; // fallback
    }

    const cleaned = properlyDecoded
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, '')
      .replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')
      .replace(/\.+$/, '');

    const uniqueName = `${timestamp}_${cleaned}`;
    cb(null, uniqueName);
  }
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
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { project } = req.body;
    const files = req.files;

    if (!files || files.length === 0 || !project || /[<>:"\/\\|?*\x00-\x1F]/.test(project.trim())) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid files or project name.' });
    }

    const results = [];

    for (const file of files) {
      const projectDir = path.join(baseUploadDir, project);
      const filePath = path.join(projectDir, file.filename);
      const localIp = getLocalIp();
      const fileUrl = `http://${localIp}:5000/#/scan?project=${project}&file=${file.filename}`;
      const qrDataUrl = await QRCode.toDataURL(fileUrl);

      // Embed QR code into the PDF
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

      results.push({
        status: 'success',
        fileUrl,
        file: file.filename,
        originalName: file.originalname,
        uploadAt: new Date().toISOString()
      });
    }

    res.json({ status: 'success', files: results });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ status: 'error', message: 'Server error during upload.' });
  }
});
/* ====== Upload endpoint - end ====== */

module.exports = router;