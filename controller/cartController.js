const path = require('path');
const fs = require('fs');

const CartModel = require('../models/CartModel');

class CartController {
    static async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;

            // Logic to add the product to the user's cart
            const addedToCart = await CartModel.addToUserCart(userId, productId, quantity); // Implement this in CartModel

            if (addedToCart) {
                return res.status(200).json({ message: 'Product added to cart successfully.' });
            } else {
                return res.status(500).json({ error: 'Failed to add product to cart.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async updateCartProduct(req, res) {
        try {
            const userId = req.body.userId;
            const productId = req.body.productId;
            const newQuantity = req.body.quantity;

            // Logic to update the quantity of a product in the user's cart
            const updated = await CartModel.updateCartProduct(userId, productId, newQuantity); // Implement this in CartModel

            if (updated) {
                return res.status(200).json({ message: 'Cart product quantity updated successfully.' });
            } else {
                return res.status(500).json({ error: 'Failed to update cart product quantity.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async removeProductFromCart(req, res) {
        try {
            const userId = req.query.userId;
            const productId = req.query.productId;
            console.log(userId, productId)

            // Logic to remove a product from the user's cart
            const removed = await CartModel.removeProduct(userId, productId); // Implement this in CartModel

            if (removed) {
                return res.status(200).json({ message: 'Product removed from cart successfully.' });
            } else {
                return res.status(500).json({ error: 'Failed to remove product from cart.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async getUserCart(req, res) {
        try {
            const userId = req.query.userId;

            // Logic to fetch the user's cart
            const cartItems = await CartModel.getUserCartItems(userId); // Implement this in CartModel
			const updated = await Promise.all(cartItems.map(getThumbnails))
            
            return res.status(200).json( updated );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    static async getAddress(req, res) {
        try {
            const userId = req.query.userId;

            // Logic to fetch the user's cart
            const address = await CartModel.getUserAddress(userId); // Implement this in CartModel
            
            return res.status(200).json( address );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async getCartItemCount(req, res) {
        try {
            const userId = req.query.userId;

            // Logic to fetch the number of items in the user's cart
            const itemCount = await CartModel.getCartItemsCount(userId); // Implement this in CartModel

            return res.status(200).json(itemCount);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async addAddress(req, res) {
        try {
            const customer_details = req.body;

            // Logic to add the product to the user's cart
            const addedAddress = await CartModel.addAddress(customer_details); // Implement this in CartModel

            if (addedAddress) {
                return res.status(200).json({ message: 'Address added successfully.' });
            } else {
                return res.status(500).json({ error: 'Failed to add address.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    static async updateAddress(req, res) {
        try {
            const customer_details = req.body;

            // Logic to add the product to the user's cart
            const updatedAddress = await CartModel.updateAddress(customer_details); // Implement this in CartModel

            if (updatedAddress) {
                return res.status(200).json({ message: 'Address updated successfully.' });
            } else {
                return res.status(500).json({ error: 'Failed to update address.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

async function getThumbnails(product) {
	try {
		const localProductImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'products', String(product.product_id));

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

module.exports = CartController;
