const ratingsAndReviewsModel = require('../models/ratingsAndReviewsModel');

class ratingsAndReviewsController {

  static async addReviewsByProduct(req, res) {
    try {
      const {product_id,rating,review,user_id} = req.body;
      const ratings = await ratingsAndReviewsModel.addRatingsAndReviewByProduct(product_id,rating,review,user_id);
      const final_rating = '';
      console.log(final_rating)
      return res.status(200).json(final_rating);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' + error });
    }
  }
  static async getRatingByProduct(req, res) {
    try {
      const product = req.params.id;
      const ratings = await ratingsAndReviewsModel.getAllRatingsByProduct(product);
      const final_rating = '';
      console.log(final_rating)
      return res.status(200).json(final_rating);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' + error });
    }
  }
  static async getReviewsByProduct(req, res) {
    try {
      const product_id = req.params.id;
      const page = req.query.page;
      const limit = req.query.limit;
      const reviews = await ratingsAndReviewsModel.getAllReviewsByProduct(product_id,page,limit);
      console.log(reviews)
      return res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' + error });
    }
  }
}

module.exports = ratingsAndReviewsController