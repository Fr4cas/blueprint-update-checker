const express = require("express");
const path = require('path');
const fs = require('fs');
const { baseUploadDir } = require('../utils/uploadHelpers');

const router = express.Router();

router.get('/', (req, res) => {
    const projectsPath = path.join(baseUploadDir);

    try {
        const projects = fs.readdirSync(projectsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                const projectName = dirent.name;
                const projectFiles = fs.readdirSync(path.join(projectsPath, projectName));
                return {
                    project: projectName,
                    files: projectFiles
                }
            });
        res.json({ status: 'success', projects });

    } catch (err) {
        console.error('Failed to list uploaded files', err);
        res.status(500).json({ status: 'error', message: 'Failed to list uploaded files' });
    }

});

module.exports = router;