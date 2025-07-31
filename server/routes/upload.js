const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const os = require('os');
const { PDFDocument } = require('pdf-lib');
const { getLocalIp, baseUploadDir, createMutlerStorage } = require("../utils/uploadHelpers")

const router = express.Router();
const storage = createMutlerStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/acad', 'application/x-acad', 'application/autocad_dwg',
    'application/x-dwg', 'image/vnd.dwg', 'application/octet-stream'];

  // reject upload if not one of the allowed mime types
  if (!allowedTypes.includes(file.mimetype)) {
    console.log(`Rejected file: ${file.originalname}`);
    console.log(`MIME type received: ${file.mimetype}`);
    return cb(new Error('Only PDF or DWG files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

/* ====== Upload endpoint - start ====== */
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { project } = req.body;
    const files = req.files;

    // Re-validate project name even though Multer does this earlier
    // protects against bypass attempts and ensures stability
    // in case of misconfigured middleware or future refactors
    if (!files || files.length === 0 || !project || /[<>:"\/\\|?*\x00-\x1F]/.test(project.trim())) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid files or project name.' });
    }

    const results = [];

    for (const file of files) {
      const projectDir = path.join(baseUploadDir, project);
      const filePath = path.join(projectDir, file.filename);
      const localIp = getLocalIp();
      const fileUrl = `http://${localIp}:5000/static/${project}/${file.filename}`;
      const qrDataUrl = await QRCode.toDataURL(`http://${localIp}:5000/#/scan?project=${project}&file=${file.filename}`);
      const isPDF = file.mimetype === 'application/pdf';
      const isDWG = file.mimetype.includes('dwg') || file.originalname.endsWith('.dwg')

      if (isPDF) {
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
      } else if (isDWG) {
        // TODO: DWG handling section
        // console.log(`DWG file uploaded: ${file.originalname}`);
      } else {
        // fallback (shouldn't happen because of filter)
        console.warn(`Unknown file type: ${file.originalname}`);
      }


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