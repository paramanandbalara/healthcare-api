// ... existing imports ...

class CartModel {
    static async addToUserCart(userId, productId, quantity) {
        try {
            console.log(userId, productId, quantity)
            // Check if the product already exists in the user's cart
            const [existingProduct] = await readDb.query(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            console.log(existingProduct.length)
            if (existingProduct.length > 0) {
                // Update the quantity if the product is already in the cart
                const updateQuery = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
                const [result] = await writeDb.query(updateQuery, [quantity, userId, productId]);
                console.log(result)
                if (result.affectedRows > 0) {
                    return true; // Product added to the cart successfully
                } else {
                    return false; // Failed to add product
                }
            } else {
                // Add the product to the cart if it doesn't exist
                const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
                const [result] = await writeDb.query(insertQuery, [userId, productId, quantity]);

                if (result.affectedRows > 0) {
                    return true; // Product added to the cart successfully
                } else {
                    return false; // Failed to add product
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error adding product to cart.');
        }
    }

    static async updateCartProduct(userId, productId, newQuantity) {
        try {
            console.log(userId, productId, newQuantity)
            // Update the quantity of the specified product in the user's cart
            const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
            const [result] = await writeDb.query(updateQuery, [newQuantity, userId, productId]);

            if (result.affectedRows > 0) {
                return true; // Product quantity updated successfully
            } else {
                return false; // Failed to update product quantity
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error updating cart product quantity.');
        }
    }

    static async removeProduct(userId, productId) {
        try {
            // Remove the specified product from the user's cart
            const deleteQuery = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
            const [result] = await writeDb.query(deleteQuery, [userId, productId]);

            if (result.affectedRows > 0) {
                return true; // Product removed from cart successfully
            } else {
                return false; // Failed to remove product from cart
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error removing product from cart.');
        }
    }

    static async getUserCartItems(userId) {
        try {
            // Fetch the items in the user's cart
            const query = 'SELECT * FROM cart c JOIN products p ON c.product_id = p.id WHERE user_id = ?';
            const [cartItems] = await readDb.query(query, [userId]);

            return cartItems;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user cart items.');
        }
    }
    static async getUserAddress(userId) {
        try {
            // Fetch the items in the user's cart
            const query = 'SELECT * FROM customer_details WHERE user_id = ?';
            const [address] = await readDb.query(query, [userId]);

            return address;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user address.');
        }
    }
    static async addAddress(customer_details) {
        try {
            const {
                user_id,
                customer_name,
                customer_city,
                customer_state,
                customer_phone,
                customer_email,
                customer_pincode,
                customer_address
            } = customer_details
            // Fetch the items in the user's cart
            const query = 'INSERT INTO customer_details (user_id, customer_name, customer_city, customer_state, customer_phone, customer_email, customer_pincode, customer_address) VALUES (?,?,?,?,?,?,?,?)';
            const data = [
                user_id,
                customer_name,
                customer_city,
                customer_state,
                customer_phone,
                customer_email,
                customer_pincode,
                customer_address
            ];
            console.log(data)
            const [address] = await writeDb.query(query, data);

            return address;
        } catch (error) {
            console.error(error);
            throw new Error('Error adding customer details.');
        }
    }
    static async updateAddress(customer_details) {
        try {
            const {
                id,
                user_id,
                customer_name,
                customer_city,
                customer_state,
                customer_phone,
                customer_email,
                customer_pincode,
                customer_address
            } = customer_details
            // Fetch the items in the user's cart
            const query = 'UPDATE customer_details SET user_id = ?, customer_name = ?, customer_city = ?, customer_state = ?, customer_phone = ?, customer_email = ?, customer_pincode = ?, customer_address = ? WHERE id = ?';
            const data = [
                user_id,
                customer_name,
                customer_city,
                customer_state,
                customer_phone,
                customer_email,
                customer_pincode,
                customer_address,
                id
            ];
            console.log(data)
            const [address] = await writeDb.query(query, data);

            return address;
        } catch (error) {
            console.error(error);
            throw new Error('Error adding customer details.');
        }
    }

    static async getCartItemsCount(userId) {
        try {
            // Fetch the count of items in the user's cart
            const query = 'SELECT SUM(quantity) AS item_count FROM cart WHERE user_id = ?';
            const [result] = await readDb.query(query, [userId]);
            console.log(result)
            return result[0].item_count || 0;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching cart items count.');
        }
    }
}

module.exports = CartModel;
