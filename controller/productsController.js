const ProductModel = require('../models/ProductModel');
const randomstring = require('randomstring');
const S3_MODULE = require('../modules/s3_connect')

class ProductsController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts();
      const updated = await Promise.all(products.map(getThumbnails))
      console.log(updated)
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  static async getAllProductsByCategory(req, res) {
    try {
      const category = req.params.id;
      const products = await ProductModel.getAllProductsByCategory(category);
      const updated = await Promise.all(products.map(getThumbnails))
      console.log(updated)
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  static async getProductById(req, res) {
    const productId = req.params.id;
    try {
      const product = await ProductModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      const S3 = new S3_MODULE();
      const files_path = `products/${product.id}`
      const files_list = await S3.filesList(files_path);
      const image_name_list = await files_list.filter(e=>!e.includes('thumbnail'));
      const product_images = await Promise.all(image_name_list.map(e=>getProductImages(product.id,e)));
      const updated = {...product,images:product_images}
      console.log(updated)
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  static async addProduct(req, res) {
    const productData = req.body;
    const productImages = req.files;
    // console.log(productImages,'add prod')
    try {
      const result = await ProductModel.addProduct(productData);

      if(!!result){
        await productImages.forEach((file) => {
          const S3 = new S3_MODULE();
          // const uploadExt = path.extname(file.originalname);
          const remotePath = `products/${result}/${file.originalname}`;
          S3.fileUpload(file, remotePath);
        });
      }
      console.log(result,'insertId');
      return res.status(201).json({ message: 'Product added successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  static async updateProduct(req, res) {
    const productId = req.params.id;
    const updatedProductData = req.body;
    const productImages = req.files;
    console.log(productImages,updatedProductData,'update prod')

    try {
      const result = await ProductModel.updateProduct(productId, updatedProductData);
      if (!result) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      if(productImages.length){
        await productImages.forEach((file) => {
          const S3 = new S3_MODULE();
          // const uploadExt = path.extname(file.originalname);
          const remotePath = `products/${productId}/${file.originalname}`;
          S3.fileUpload(file, remotePath);
        });
      }
      return res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  static async deleteProduct(req, res) {
    const productId = req.params.id;
    try {
      const result = await ProductModel.deleteProduct(productId);
      if (!result) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      const S3 = new S3_MODULE();
      const files_path = `products/${productId}`
      await S3.emptyS3Directory(files_path);
      return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  // static async addProductImage(req, res) {
  //   const productId = req.params.id;
  //   const base64Images = req.body.images;
  //   try {
  //     const result = await ProductModel.addProductImage(productId, base64Images);
  //     return res.status(201).json({ message: 'Image added to product successfully.' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal server error.' });
  //   }
  // }

  // static async deleteProductImage(req, res) {
  //   const imageId = req.params.imageId;
  //   try {
  //     const result = await ProductModel.deleteProductImage(imageId);
  //     if (!result) {
  //       return res.status(404).json({ error: 'Image not found.' });
  //     }
  //     return res.status(200).json({ message: 'Product image deleted successfully.' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal server error.' });
  //   }
  // }
  // static async getThumbnailByProductId(req, res) {
  //   const productId = req.params.id;
  //   console.log(productId)
  //   try {

  //     const S3 = new S3_MODULE();
  //     const files_path = `products/${productId}`
  //     const files_list = await S3.filesList(files_path);
  //     const thumbnail_name = await files_list.filter(e=>e.includes('thumbnail'))[0];
  //     const thumbnail_path = `products/${productId}/${thumbnail_name}`
  //     const thumbnail_link = await S3.getDownloadLink(thumbnail_path);
  //     // const result = await ProductModel.deleteProductImage(imageId);
  //     if (!thumbnail_link) {
  //       return res.status(404).json({ error: 'Image not found.' });
  //     }
  //     return res.status(200).json({ data: thumbnail_link });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal server error.' });
  //   }
  // }
}

async function getThumbnails(product){
  try {

    const S3 = new S3_MODULE();
    const files_path = `products/${product.id}`
    const files_list = await S3.filesList(files_path);
    if(!files_list.length)return product
    const thumbnail_name = await files_list.filter(e=>e.includes('thumbnail'))[0];
    const thumbnail_path = `products/${product.id}/${thumbnail_name}`
    const thumbnail_link = await S3.getDownloadLink(thumbnail_path);
    product['thumbnail'] = thumbnail_link;
    console.log(thumbnail_link,'1')
    return product

  } catch (error) {
    console.error(error)
  }
}
async function getProductImages(productId,image_name){
  try {

    const S3 = new S3_MODULE();
    // const files_path = `products/${product.id}`
    // const files_list = await S3.filesList(files_path);
    // const image_name_list = await files_list.filter(e=>!e.includes('thumbnail'));
    const image_path = `products/${productId}/${image_name}`
    const image_link = await S3.getDownloadLink(image_path);
    // product['thumbnail'] = thumbnail_link;
    console.log(image_link,image_name,'1')
    return image_link

  } catch (error) {
    console.error(error)
  }
}

function getSku() {
  let sku = randomstring.generate({
      length: 5,
      charset: 'numeric'
  });
  return `HOMEO${sku}`
}

module.exports = ProductsController;
