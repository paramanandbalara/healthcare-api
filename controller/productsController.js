const ProductModel = require('../models/ProductModel');
const randomstring = require('randomstring');
const S3_MODULE = require('../modules/s3_connect');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

class ProductsController {
	static async getAllProducts(req, res) {
		try {
			const products = await ProductModel.getAllProducts();
			const updated = await Promise.all(products.map(getThumbnails))
			// console.log(updated)
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
			const localProductImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(productId));

			// Get the list of image names (excluding thumbnails)
			const imageNames = fs.readdirSync(localProductImagesPath).filter(e => !e.includes('thumbnail'));

			// Get the download links for each image
			const productImages = await Promise.all(imageNames.map(imageName => getProductImages(productId, imageName)));
			const updated = { ...product, images: productImages }
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
			const sku = await getSku(productData.product_name);
			productData['sku'] = sku;
			// return
			const result = await ProductModel.addProduct(productData);

			if (!!result) {
				const productId = result; // Assuming result is the inserted product ID

				// Create a directory for the product's images if it doesn't exist
				const productImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(productId));
				if (!fs.existsSync(productImagesPath)) {
					fs.mkdirSync(productImagesPath);
				}

				// Iterate through the uploaded files and save them locally
				await Promise.all(productImages.map(async (file) => {
					const filePath = path.join(productImagesPath, file.originalname);
					console.log(filePath)
					await writeFileAsync(filePath, file.buffer);
				}));
			}
			// console.log(result,'insertId');
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

		try {
			const result = await ProductModel.updateProduct(productId, updatedProductData);
			if (!result) {
				return res.status(404).json({ error: 'Product not found.' });
			}
			if (productImages.length) {
				const productImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(productId));
				if (!fs.existsSync(productImagesPath)) {
					fs.mkdirSync(productImagesPath);
				}

				// Iterate through the uploaded files and save them locally
				await Promise.all(productImages.map(async (file) => {
					//remove duplicate start
					await removeExistingImages(productImagesPath, file.originalname);

					const filePath = path.join(productImagesPath, file.originalname);
					await writeFileAsync(filePath, file.buffer);
				}));
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
			// Call your ProductModel to delete the product from the database
			const deletedProduct = await ProductModel.deleteProduct(productId);

			if (!deletedProduct) {
				return res.status(404).json({ error: 'Product not found.' });
			}

			// Delete the files in the saved directory
			const productImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(productId));

			// Get the list of all files in the directory
			const files = fs.readdirSync(productImagesPath);

			// Delete each file
			files.forEach((file) => {
				const filePath = path.join(productImagesPath, file);
				fs.unlinkSync(filePath);
				console.log(`Deleted file: ${filePath}`);
			});

			return res.status(200).json({ message: 'Product deleted successfully.' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' });
		}
	}
}

async function removeExistingImages(img_path, img_name) {
	try {
		const files = fs.readdirSync(img_path);
		const existingFiles = files.filter(e => e.includes(img_name.split('.')[0]));

		await existingFiles.forEach(e => {
			const filePath = path.join(img_path, e);
			fs.unlinkSync(filePath);
		});
	} catch (error) {
		console.error(error);
	}
}

async function getThumbnails(product) {
	try {
		const localProductImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(product.id));

		// Get the list of image names (excluding thumbnails)
		const imageNames = fs.readdirSync(localProductImagesPath).filter(e => e.includes('thumbnail'));
		if (!imageNames.length) {
			return product
		}
		const imageBuffer = fs.readFileSync(path.join(localProductImagesPath, imageNames[0]));
		const base64Image = imageBuffer.toString('base64');
		product['thumbnail'] = base64Image;
		return product

	} catch (error) {
		console.error(error)
	}
}
async function getProductImages(productId, image_name) {
	try {
		const localProductImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(productId));

		const imageBuffer = fs.readFileSync(path.join(localProductImagesPath, image_name));
		const base64Image = imageBuffer.toString('base64');
		const imageData = {
			name: image_name,
			data: base64Image,
		};
		return imageData;

	} catch (error) {
		console.error(error)
	}
}

async function getSku(productName) {
	let sku_num = randomstring.generate({
		length: 5,
		charset: 'numeric'
	});
	// Remove spaces and convert to uppercase
	const cleanedProductName = productName.replace(/\s/g, '').toUpperCase();

	// Remove spaces and convert to uppercase
	// const cleanedProductCategory = productCategory.replace(/\s/g, '').toUpperCase();

	// Combine components to create the SKU
	const sku = `HOMOEO${cleanedProductName.substring(0, 3)}${sku_num}`;
	const checkSku = await ProductModel.getProductBySKU(sku);
	if (checkSku.length) {
		getSku(productName)
	}

	return sku
}

module.exports = ProductsController;
