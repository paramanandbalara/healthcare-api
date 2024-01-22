const express = require('express');
const router = express.Router();
const servicesController = require('../controller/servicesController');

const multer = require('multer');
const os = require('os');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: os.tmpdir() + '/homeopatha',
    filename: function (req, file, cb) {
        console.log(file,'file')
        let name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const upload = multer({
    storage: multerStorage,
});

function cleanupTemporaryFiles() {
    fs.readdir(temporaryDirectory, (err, files) => {
      if (err) {
        console.error('Error reading temporary directory:', err);
        return;
      }
  
      // Iterate through the files and remove them
      files.forEach((file) => {
        const filePath = path.join(temporaryDirectory, file);
  
        // Use fs.unlink to remove the file
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          } else {
            console.log('File deleted successfully:', filePath);
          }
        });
      });
    });
  }
  
  // Call the cleanup function as needed, for example, on application shutdown
  // cleanupTemporaryFiles();
  
  module.exports = router;