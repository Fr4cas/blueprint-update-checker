const path = require('path');
const { isLatestVersion } = require('../routes/compare');

const projectName = 'project1';
const scannedFilePath = path.join(__dirname, '../uploads/projects/project1/20250624_145030_blueprint.pdf');

if (require.main === module) {
    console.log('--- Manual Test: isLatestVersion ---');
    isLatestVersion(projectName, scannedFilePath);
}