const { match } = require('assert');
const { time } = require('console');
const fs = require('fs');
const path = require('path');

function extractTimestamp(filename) {
    const match = filename.match(/\d{8}_\d{6}/);
    return match ? match[0] : null;
}

function isLatestVersion(projectName, scannedFilePath) {
    const scannedFileName = path.basename(scannedFilePath);
    const scannedTimestamp = extractTimestamp(scannedFileName);

    const suffix = scannedFileName.replace(`${scannedTimestamp}_`, '').trim().toLowerCase();
    console.log('Scanned suffix', suffix);

    const projectDir = path.join(__dirname, '../', 'uploads', 'projects', projectName);
    const allFiles = fs.readdirSync(projectDir);

    // console.log('Scanned timestamp', scannedTimestamp);
    // console.log('All files', allFiles);

    // Match names of files before extracting timestamps
    const matchingFiles = allFiles.filter(filename => filename.trim().toLowerCase().endsWith(suffix));

    // console.log('Matching files', matchingFiles);

    const timestamps = matchingFiles
        .map(filename => extractTimestamp(filename))
        .filter(Boolean);

    console.log('Filtered timestamps', timestamps);

    // Bit that does the comparing
    if (timestamps.length === 0) {
        return {
            isLatest: false,
            reason: 'No matching files found',
            scannedTimestamp,
            latestTimestamp: null
        };
    }

    const latestTimestamp = timestamps.sort().at(-1);

    const isLatest = scannedTimestamp === latestTimestamp;
    console.log('Is latest: ', isLatest);

    return {
        isLatest,
        scannedTimestamp,
        latestTimestamp
    };

}

module.exports = { isLatestVersion };