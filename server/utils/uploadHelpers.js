const path = require('path');
const multer = require('multer');
const fs = require('fs');
const os = require('os');
const iconv = require('iconv-lite');

// get the ip to use for qr code links (used in file access URLs)
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

// Base upload directory setup
const baseUploadDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(baseUploadDir)) fs.mkdirSync(baseUploadDir, { recursive: true });

// normalize and sanitize filename to avoid invalid characters and ensure consistency
function sanitizeFilename(originalname) {
    // fix encoding: convert ISO-8859-1 → UTF-8
    let properlyDecoded;
    try {
        const buffer = Buffer.from(originalname, 'latin1'); // interpret as ISO-8859-1
        properlyDecoded = buffer.toString('utf8');
    } catch {
        properlyDecoded = originalname;
    }

    return properlyDecoded
        .normalize('NFC')
        .trim()
        .replace(/\s+/g, '')
        .replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')
        .replace(/\.+$/, '');
}

// Wraps the destination and filename logic together (multer config)
function createMutlerStorage() {
    return multer.diskStorage({
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
            const cleaned = sanitizeFilename(file.originalname);
            const uniqueName = `${timestamp}_${cleaned}`;
            cb(null, uniqueName);
        }
    });
}

module.exports = { getLocalIp, baseUploadDir, sanitizeFilename, createMutlerStorage };