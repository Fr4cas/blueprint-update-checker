const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const projectsDir = path.join(__dirname, '../uploads/projects');

router.get('/', (req, res) => {
  fs.readdir(projectsDir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not list project folders' });

    const folders = files
      .filter(file => file.isDirectory())
      .map(dir => ({ id: dir.name, name: dir.name }));

    res.json(folders);
  });
});

module.exports = router;