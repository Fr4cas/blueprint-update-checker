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

module.exports = { getLocalIp, baseUploadDir };