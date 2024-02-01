const express = require('express');
const router = express.Router();
const servicesController = require('../controller/servicesController');

const multer = require('multer');
const os = require('os');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage,
});


router.get('/services', servicesController.getAllServices);
router.get('/services/:id', servicesController.getServiceById);
router.post('/services', upload.array('files'), servicesController.addService);
router.put('/services/:id', upload.array('files'), servicesController.updateService);

//service request routes
router.post('/service-request/add', servicesController.addServiceRequest);
router.get('/service-request/get', servicesController.getServiceRequests);
router.get('/service-request/list', servicesController.getServiceRequestsByUser);
// router.get('/service-request/details', servicesController.getServiceRequestRemarks);
router.get('/service-request/remarks', servicesController.getServiceRequestRemarks);
router.post('/service-request/remarks', servicesController.addServiceRequestRemark);

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