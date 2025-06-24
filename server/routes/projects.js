// Responsible for listing project folders

const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const projectsDir = path.join(__dirname, '../uploads/projects');

// GET existing project folders
router.get('/', (req, res) => {
  fs.readdir(projectsDir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not list project folders' });
    const folders = files.filter(file => file.isDirectory()).map(dir => ({ id: dir.name, name: dir.name }));
    res.json(folders);
  });
});

// POST new project folder
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
    return res.status(400).json({ error: 'Invalid project name.' });
  }
  const newProjectPath = path.join(projectsDir, name);
  if (fs.existsSync(newProjectPath)) {
    return res.status(409).json({ error: 'Project already exists.' });
  }
  fs.mkdirSync(newProjectPath, { recursive: true });
  res.status(201).json({ message: 'Project created successfully.' });
});

module.exports = router;