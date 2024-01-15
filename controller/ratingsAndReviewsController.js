const ratingsAndReviewsModel = require('../models/ratingsAndReviewsModel');

class ratingsAndReviewsController {

  static async getRatingByProduct(req, res) {
    try {
      const product = req.params.id;
      const ratings = await ratingsAndReviewsModel.getAllRatingsByProduct(product);
      const final_rating = '';
      console.log(final_rating)
      return res.status(200).json(final_rating);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  static async getReviewsByProduct(req, res) {
    try {
      const product = req.params.id;
      const reviews = await ratingsAndReviewsModel.getAllReviewsByProduct(product);
      console.log(reviews)
      return res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

module.exports = ratingsAndReviewsController