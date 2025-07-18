const path = require('path');
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

module.exports = { getLocalIp, baseUploadDir, sanitizeFilename };