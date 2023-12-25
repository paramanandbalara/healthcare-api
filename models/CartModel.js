// ... existing imports ...

class CartModel {
    static async addToUserCart(userId, productId, quantity) {
        try {
            // Check if the product already exists in the user's cart
            const existingProduct = await readDb.query(
                'SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existingProduct.length > 0) {
                // Update the quantity if the product is already in the cart
                const updateQuery = 'UPDATE user_cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
                await writeDb.query(updateQuery, [quantity, userId, productId]);
            } else {
                // Add the product to the cart if it doesn't exist
                const insertQuery = 'INSERT INTO user_cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
                await writeDb.query(insertQuery, [userId, productId, quantity]);
            }

            return true; // Product added to the cart successfully
        } catch (error) {
            console.error(error);
            throw new Error('Error adding product to cart.');
        }
    }

    static async updateCartProduct(userId, productId, newQuantity) {
        try {
            // Update the quantity of the specified product in the user's cart
            const updateQuery = 'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
            const result = await writeDb.query(updateQuery, [newQuantity, userId, productId]);

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
            const deleteQuery = 'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?';
            const result = await writeDb.query(deleteQuery, [userId, productId]);

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
            const query = 'SELECT * FROM user_cart WHERE user_id = ?';
            const cartItems = await readDb.query(query, [userId]);

            return cartItems;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user cart items.');
        }
    }

    static async getCartItemsCount(userId) {
        try {
            // Fetch the count of items in the user's cart
            const query = 'SELECT SUM(quantity) AS item_count FROM user_cart WHERE user_id = ?';
            const result = await readDb.query(query, [userId]);

            return result[0].item_count || 0;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching cart items count.');
        }
    }
}

module.exports = CartModel;
