
class Order {
    static async createOrder(userId, cartItems, customer_details_id) {
        try {
            // Calculate total amount based on cart items
            const totalAmount = await cartItems.reduce((acc, item) => acc + ((item.price - (item.price * item.discount / 100)) * item.quantity), 0).toFixed(2);
            // Create a new order
            const [{ insertId: orderId }] = await writeDb.query('INSERT INTO orders (user_id, total_amount, customer_details_id) VALUES (?, ?, ?)', [userId, totalAmount, customer_details_id]);
            console.log(orderId)

            // Insert order items into the order_items table
            for (const item of cartItems) {
                const [order_details] = await writeDb.query('INSERT INTO order_items (order_id, product_id, quantity, price, discount) VALUES (?, ?, ?, ?, ?)', [orderId, item.product_id, item.quantity, item.price, item.discount]);
                console.log(order_details)
            }

            // Clear the user's cart after creating the order
            await writeDb.query('DELETE FROM cart WHERE user_id = ?', [userId]);

            return { success: true, orderId, message: 'Order created successfully.' };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, message: 'Failed to create order.' };
        }
    }

    static async getOrderHistory(userId) {
        try {
            const [orderHistory] = await readDb.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created DESC', [userId]);
            return orderHistory;
        } catch (error) {
            console.error('Error fetching order history:', error);
            return { success: false, message: 'Failed to fetch order history.' };
        }
    }
    static async updateOrderStatus(order_id, status) {
        try {
            const [status_update] = await writeDb.query('UPDATE orders SET status = ? WHERE id = ?', [status, order_id]);
            return status_update;
        } catch (error) {
            console.error('Error updating order status:', error);
            return { success: false, message: 'Failed to update order status.' };
        }
    }
    static async getAllOrderHistory() {
        try {
            const [orderHistory] = await readDb.query(`SELECT
            o.id AS order_id,
            o.total_amount,
            o.created,
            o.status,
            cd.customer_name,
            cd.customer_city,
            cd.customer_state,
            cd.customer_phone,
            cd.customer_email,
            cd.customer_pincode,
            cd.customer_address,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'product_id', p.id,
                'product_name', p.product_name,
                'manufacturer', p.manufacturer,
                'price', oi.price,
                'quantity', oi.quantity,
                'discount', oi.discount
              )
            ) AS order_items
          FROM
            orders o
            JOIN customer_details cd ON o.customer_details_id = cd.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
          GROUP BY
            o.id
          ORDER BY
            o.created DESC;
          `);
            return orderHistory;
        } catch (error) {
            console.error('Error fetching order history:', error);
            return { success: false, message: 'Failed to fetch order history.' };
        }
    }

    static async getOrderDetails(orderId) {
        try {
            const [orderDetails] = await readDb.query('SELECT o.created as order_date ,oi.*,p.product_name FROM orders o JOIN order_items oi JOIN products p ON oi.product_id = p.id AND o.id = oi.order_id WHERE o.id = ?', [orderId]);
            return orderDetails;
        } catch (error) {
            console.error('Error fetching order details:', error);
            return { success: false, message: 'Failed to fetch order details.' };
        }
    }
    static async getPurchaseDetails(userId, productId) {
        try {
            const [purchaseDetails] = await readDb.query('SELECT * FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = 1 AND oi.product_id = 4', [userId, productId]);
            return purchaseDetails;
        } catch (error) {
            console.error('Error fetching purchase details:', error);
            return { success: false, message: 'Failed to fetch purchase details.' };
        }
    }
}

module.exports = Order;
