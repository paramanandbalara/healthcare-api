class ratingsAndReviewsModel {
    static async addRatingsAndReviewByProduct(product_id,rating,review,user_id) {
        try {
            const query = 'INSERT INTO rating_review (product_id,rating,review,user_id) VALUES (?, ?, ?, ?);';
            const [ratings] = await writeDb.query(query, [product_id,rating,review,user_id]);
            return ratings;
        } catch (error) {
            console.log(error)
            throw new Error('Error adding review.');
        }
    }
    static async getAllRatingsByProduct(productId) {
        try {
            const query = 'SELECT rating FROM rating_review WHERE product_id = ?';
            const [ratings] = await readDb.query(query, [productId]);
            return ratings;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching rating.');
        }
    }
    static async getAllReviewsByProduct(productId, page, limit) {
        try {
            const offset = (page - 1) * limit;
            const count_limit = Number(limit);
            const query = `SELECT rr.review as review, rr.rating as rating, rr.created as created, u.name as user FROM rating_review as rr JOIN users as u ON rr.user_id = u.id WHERE product_id = ? LIMIT ? OFFSET ?`;
            const [reviews] = await readDb.query(query, [productId, count_limit, offset]);
            return reviews;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching reviews.');
        }
    }
}

module.exports = ratingsAndReviewsModel