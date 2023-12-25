// ... existing imports ...
const ProductModel = require('../models/ProductModel');

class ProductsController {
  static async getAllProducts(req, res) {
    try {
      const page = req.query.page || 1; // Get the requested page (default to 1 if not specified)
      const limit = 20; // Number of items per page

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Fetch products from the database with pagination
      const products = await ProductModel.getAllProductsPaginated(limit, offset); // Implement this in ProductModel

      return res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  static async getSingleProduct(req, res) {
    try {
      const productId = req.params.productId;

      // Fetch a single product by its ID from the database
      const product = await ProductModel.getSingleProductById(productId); // Implement this in ProductModel

      if (product) {
        return res.status(200).json({ product });
      } else {
        return res.status(404).json({ error: 'Product not found.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

module.exports = ProductsController;
