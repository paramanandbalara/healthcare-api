class ratingsAndReviewsModel {
    static async getAllRatingsByProduct(productId) {
        try {
          const query = 'SELECT ratings FROM rating_reviews WHERE product_id = ?';
          const [ratings] = await readDb.query(query,[productId]);
          return ratings;
        } catch (error) {
          throw new Error('Error fetching products.');
        }
      }
    static async getAllReviewsByProduct(productId) {
        try {
          const query = 'SELECT * FROM rating_reviews WHERE product_id = ?';
          const [reviews] = await readDb.query(query,[productId]);
          return reviews;
        } catch (error) {
          throw new Error('Error fetching products.');
        }
      }
}

module.exports = ratingsAndReviewsModel