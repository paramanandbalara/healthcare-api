// ... existing imports ...

class OrderModel {
    static async createOrder({ userId, products, shippingAddress, paymentMethod, additionalNotes, totalAmount, paymentIntentId }) {
        try {
          // Insert order details into the database
          const insertOrderQuery = 'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, additional_notes, payment_intent_id) VALUES (?, ?, ?, ?, ?, ?)';
          const insertOrderValues = [userId, totalAmount, shippingAddress, paymentMethod, additionalNotes, paymentIntentId];
          const orderResult = await writeDb.query(insertOrderQuery, insertOrderValues);
    
          const orderId = orderResult.insertId;
    
          // Insert order items into the order_details table
          const orderDetailsInsertQuery = 'INSERT INTO order_details (order_id, product_id, quantity) VALUES ?';
          const orderDetailsValues = products.map(product => [orderId, product.productId, product.quantity]);
          await writeDb.query(orderDetailsInsertQuery, [orderDetailsValues]);
    
          return true; // Order placed successfully
        } catch (error) {
          console.error(error);
          throw new Error('Error placing order.');
        }
      }

    static async getUserOrders(userId) {
        try {
            // Fetch all orders for a user
            const query = 'SELECT * FROM orders WHERE user_id = ?';
            const userOrders = await readDb.query(query, [userId]);

            return userOrders;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user orders.');
        }
    }

    static async getSingleOrderById(orderId) {
        try {
            // Fetch a single order by its ID
            const query = 'SELECT * FROM orders WHERE id = ?';
            const order = await readDb.query(query, [orderId]);

            return order.length ? order[0] : null;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching single order.');
        }
    }

    static async updateOrderById(orderId, updatedInfo) {
        try {
            const {
                shippingAddress,
                paymentMethod,
                additionalNotes,
                updatedItems // Array of updated items in the order [{ productId, quantity }, ...]
            } = updatedInfo;

            const updates = [];
            const values = [];

            if (shippingAddress) {
                updates.push('shipping_address = ?');
                values.push(shippingAddress);
            }

            if (paymentMethod) {
                updates.push('payment_method = ?');
                values.push(paymentMethod);
            }

            if (additionalNotes) {
                updates.push('additional_notes = ?');
                values.push(additionalNotes);
            }

            let updateItemsSuccess = true;

            if (updatedItems && updatedItems.length > 0) {
                // Transaction to update items in the order_details table
                await writeDb.beginTransaction();

                try {
                    for (const updatedItem of updatedItems) {
                        const { productId, quantity } = updatedItem;

                        const updateItemQuery = 'UPDATE order_details SET quantity = ? WHERE order_id = ? AND product_id = ?';
                        const updateItemValues = [quantity, orderId, productId];
                        const result = await writeDb.query(updateItemQuery, updateItemValues);

                        if (result.affectedRows === 0) {
                            updateItemsSuccess = false;
                            break;
                        }
                    }

                    if (updateItemsSuccess) {
                        await writeDb.commit();
                    } else {
                        await writeDb.rollback();
                    }
                } catch (error) {
                    await writeDb.rollback();
                    throw error;
                }
            }

            const updateQuery = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
            const updateValues = [...values, orderId];
            const result = await writeDb.query(updateQuery, updateValues);

            return result.affectedRows > 0 && updateItemsSuccess;
        } catch (error) {
            console.error(error);
            throw new Error('Error updating order.');
        }
    }

    static async cancelOrderById(orderId) {
        try {
            const cancelQuery = 'UPDATE orders SET status = ? WHERE id = ?';
            const cancelValues = ['cancelled', orderId];

            const result = await writeDb.query(cancelQuery, cancelValues);

            return result.affectedRows > 0;
        } catch (error) {
            console.error(error);
            throw new Error('Error cancelling order.');
        }
    }

    static async getOrderDetailsById(orderId) {
        try {
            const orderQuery = `
            SELECT 
              o.id as order_id,
              o.total_amount,
              o.shipping_address,
              o.payment_method,
              o.additional_notes,
              od.product_id,
              od.quantity
            FROM orders o
            LEFT JOIN order_details od ON o.id = od.order_id
            WHERE o.id = ?
          `;

            const orderDetails = await readDb.query(orderQuery, [orderId]);

            if (orderDetails.length === 0) {
                return null;
            }

            // Constructing the order details object
            const orderInfo = {
                orderId: orderDetails[0].order_id,
                totalAmount: orderDetails[0].total_amount,
                shippingAddress: orderDetails[0].shipping_address,
                paymentMethod: orderDetails[0].payment_method,
                additionalNotes: orderDetails[0].additional_notes,
                items: orderDetails.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                })),
            };

            return orderInfo;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching order details.');
        }
    }
}

module.exports = OrderModel;
