// const readDb = require('../database/readDb');
// const writeDb = require('../database/writeDb');

class ProductModel {
  static async getAllProducts() {
    try {
      const query = 'SELECT * FROM products';
      const [products] = await readDb.query(query);
      return products;
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching products.');
    }
  }
  static async getAllProductsByCategory(category) {
    try {
      const query = 'SELECT * FROM products WHERE category = ?';
      const [products] = await readDb.query(query,[category]);
      return products;
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching products.');
    }
  }
  static async getAllProductBestseller() {
    try {
      const query = `SELECT * FROM products WHERE bestseller = 1`;
      const [products] = await readDb.query(query);
      console.log(products)
      return products;
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching products.');
    }
  }
  static async updateProductBestseller(bestseller,product_id) {
    try {
      const query = 'UPDATE products SET bestseller = ? WHERE id = ?';
      const [result] = await readDb.query(query,[bestseller,product_id]);
      return result.affectedRows > 0 ? result.insertId : false;;
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching products.');
    }
  }

  static async getProductById(productId) {
    try {
      const query = 'SELECT p.*, AVG(rr.rating) AS rating FROM products p JOIN rating_review rr ON rr.product_id = p.id WHERE p.id = ?';
      const [product] = await readDb.query(query, [productId]);
      return product[0];
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching product.');
    }
  }
  static async getProductBySKU(productSku) {
    try {
      const query = 'SELECT * FROM products WHERE sku = ?';
      const [product] = await readDb.query(query, [productSku]);
      return product;
    } catch (error) {
			console.error(error);
      throw new Error('Error fetching product.');
    }
  }

  static async addProduct(productData) {
    try {
      const {
        product_name,
        description,
        manufacturer,
        price,
        discount,
        availability,
        category,
        sku
        // thumbnail,
      } = productData;

      const query =
        'INSERT INTO products (product_name, description, manufacturer, price, discount, availability, category, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [
        product_name,
        description,
        manufacturer,
        price,
        discount,
        availability || 1, // Default to 1 if availability is not provided
        category,
        sku
        // thumbnail,
      ];

      const [result] = await writeDb.query(query, values);
      return result.affectedRows > 0 ? result.insertId : false;
    } catch (error) {
			console.error(error);
      throw new Error('Error adding product.');
    }
  }

  static async updateProduct(productId, updatedProductData) {
    try {
      const {
        product_name,
        description,
        manufacturer,
        price,
        discount,
        availability,
        category,
      } = updatedProductData;

      const query =
        'UPDATE products SET product_name = ?, description = ?, manufacturer = ?, price = ?, discount = ?, availability = ?, category = ? WHERE id = ?';
      const values = [
        product_name,
        description,
        manufacturer,
        price,
        discount,
        availability || 1,
        category,
        productId,
      ];

      const [result] = await writeDb.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
			console.error(error);
      throw new Error('Error updating product.');
    }
  }

  static async deleteProduct(productId) {
    try {
      const query = 'DELETE FROM products WHERE id = ?';
      const [result] = await writeDb.query(query, [productId]);
      return result.affectedRows > 0;
    } catch (error) {
			console.error(error);
      throw new Error('Error deleting product.');
    }
  }

  // static async addProductImage(productId, base64Images) {
  //   try {
  //     const query =
  //       'INSERT INTO product_images (product_id, image) VALUES (?, ?)';
  //     const values = base64Images.map((image) => [productId, image]);

  //     const [result] = await writeDb.query(query, values);
  //     return result.affectedRows > 0;
  //   } catch (error) {
  //     throw new Error('Error adding product image.');
  //   }
  // }

  // static async deleteProductImage(imageId) {
  //   try {
  //     const query = 'DELETE FROM product_images WHERE id = ?';
  //     const [result] = await writeDb.query(query, [imageId]);
  //     return result.affectedRows > 0;
  //   } catch (error) {
  //     throw new Error('Error deleting product image.');
  //   }
  // }
}

module.exports = ProductModel;
