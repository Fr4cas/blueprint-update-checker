const fs = require('fs');
const path = require('path');

// Gets time from filename
function extractTimestamp(filename) {
    const match = filename.match(/\d{8}_\d{6}/);
    return match ? match[0] : null;
}

function isLatestVersion(projectName, scannedFilePath) {
    const scannedFileName = path.basename(scannedFilePath);
    const scannedTimestamp = extractTimestamp(scannedFileName);

    const suffix = scannedFileName.replace(`${scannedTimestamp}_`, '');
    console.log('Scanned suffix', suffix);

    const projectDir = path.join(__dirname, '../', 'uploads', 'projects', projectName);

    const allFiles = fs.readdirSync(projectDir);

    console.log('Scanned timestamp', scannedTimestamp);
    console.log('All files', allFiles);

    // Extract timestamp from files
    const timestamps = allFiles
        .map(filename => extractTimestamp(filename))
        .filter(Boolean)

    console.log('All timestamps', timestamps);

    return null
}

module.exports = { isLatestVersion };