const express = require('express');
const path = require('path');
const { isLatestVersion } = require('./compare');

const router = express.Router();

router.post('/', (req, res) => {
  const { project, scannedFile } = req.body;

  if (!project || !scannedFile) {
    return res.status(400).json({ error: 'Missing project or scannedFile' });
  }

  const scannedFilePath = path.join(__dirname, '../uploads/projects', project, scannedFile);
  const result = isLatestVersion(project, scannedFilePath);

  res.json(result);
});

module.exports = router;