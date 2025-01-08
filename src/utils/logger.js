// filepath: src/utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'activity.log');

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logActivity = (message) => {
  const logMessage = `[LOG] ${new Date().toISOString()}: ${message}\n`;
  console.log(logMessage);
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });
};

module.exports = logActivity;