const path = require('path');
const { isLatestVersion } = require('../routes/compare');

const projectName = 'project1';
const scannedFilePath = path.join(__dirname, '../uploads/projects', projectName, '20250624_145030_blueprint1.pdf');

if (require.main === module) {
    console.log('--- Running compare logic test ---');
    isLatestVersion(projectName, scannedFilePath);
}