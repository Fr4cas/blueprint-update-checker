const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /scan
router.post('/', (req, res) => {
  const { scannedText } = req.body;

  // prevents malformed or missing data from triggering file access
  if (!scannedText || typeof scannedText !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Invalid scanned data' });
  }

  try {
    // retrieve filename from scanned PDF URL, assumes scannedText ends with the PDF filename (change here if adding more file types)
    const filename = path.basename(scannedText, '.pdf') + '.json';
    const metadataPath = path.join(__dirname, '../metadata', filename);

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({ status: 'error', message: 'Metadata not found for scanned file' });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    return res.json({ status: 'success', metadata });
  } catch (err) {
    console.error('Scan processing error:', err);
    return res.status(500).json({ status: 'error', message: 'Server error while processing scan' });
  }
});

module.exports = router;