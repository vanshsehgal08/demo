const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destPath = path.join(__dirname, '../public/pdf.worker.min.js');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'));
}

// Copy the file
fs.copyFileSync(sourcePath, destPath);
console.log('PDF.js worker file copied successfully!'); 