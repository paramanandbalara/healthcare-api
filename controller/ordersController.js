// controllers/orderController.js
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const path = require('path');
const fs = require('fs');

class OrdersController {
    static async createOrder(req, res) {
        const { userId, customer_details_id } = req.body;

        try {
            const cartItems = await Cart.getUserCartItems(userId);
            
            if (!cartItems?.length) {
                return res.status(500).json({ success: false, message: 'Failed to retrieve cart items.' });
            }

            const orderCreationResult = await Order.createOrder(userId, cartItems, customer_details_id);

            if (!orderCreationResult.success) {
                return res.status(500).json({ success: false, message: 'Failed to create order.' });
            }

            return res.json({ success: true, orderId: orderCreationResult.orderId, message: 'Order created successfully.' });
        } catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    static async updateStatus(req, res) {
        
        try {
            const { order_id, status } = req.body;
            const statusUpdate = await Order.updateOrderStatus(order_id, status);

            // if (!orderHistoryResult.length) {
            //     return res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
            // }

            return res.json({ success: true, data: statusUpdate });
        } catch (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
    static async getOrderHistory(req, res) {
        const { userId } = req.query;

        try {
            const orderHistoryResult = await Order.getOrderHistory(userId);

            // if (!orderHistoryResult.length) {
            //     return res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
            // }

            return res.json({ success: true, data: orderHistoryResult });
        } catch (error) {
            console.error('Error fetching order history:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
    static async getAllOrderHistory(req, res) {
        // const { userId } = req.query;

        try {
            const orderHistoryResult = await Order.getAllOrderHistory();
			const updated = await Promise.all(orderHistoryResult.map(async (e)=>{
                await Promise.all(e.order_items.map(getThumbnails))
                return e
            }))
            // if (!orderHistoryResult.length) {
            //     return res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
            // }

            return res.json(updated);
        } catch (error) {
            console.error('Error fetching order history:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    static async getOrderDetails(req, res) {
        const { orderId } = req.query;

        try {
            const orderDetailsResult = await Order.getOrderDetails(orderId);
			const updated = await Promise.all(orderDetailsResult.map(getThumbnails))

            if (!orderDetailsResult.length) {
                return res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
            }

            return res.json({ success: true, data: updated });
        } catch (error) {
            console.error('Error fetching order details:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
    static async getPurchaseDetails(req, res) {
        const { userId, productId } = req.query;

        try {
            const purchaseDetailsResult = await Order.getPurchaseDetails(userId, productId);

            return res.json(purchaseDetailsResult);
        } catch (error) {
            console.error('Error fetching order details:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
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

module.exports = OrdersController;