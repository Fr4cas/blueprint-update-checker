require('dotenv').config();
const path = require('path');

module.exports = {
    nasRoot: process.env.NAS_ROOT,
    getProjectPath: (project) =>
        path.join(process.env.NAS_ROOT, project)
};