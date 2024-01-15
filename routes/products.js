const express = require('express');
const router = express.Router();
const productsController = require('../controller/productsController');

const multer = require('multer');
const os = require('os');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: os.tmpdir() + '/homeopatha',
    filename: function (req, file, cb) {
        let name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const upload = multer({
    storage: multerStorage,
});

router.get('/product', productsController.getAllProducts);
router.get('/product/:id', productsController.getProductById);
router.post('/product', upload.array('files'), productsController.addProduct);
router.put('/product/:id', upload.array('files'), productsController.updateProduct);
router.delete('/product/:id', productsController.deleteProduct);
// router.post('/product/images/:id', upload.array('files'), productsController.addProductImage);
// router.delete('/product/images/:imageId', productsController.deleteProductImage);
router.get('/product/category/:id', productsController.getAllProductsByCategory);

const temporaryDirectory = path.join(os.tmpdir(), 'homeopatha');

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
