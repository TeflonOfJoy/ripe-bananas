/**
 * Review routes
 * Handles all review-related API endpoints
 */

const express = require('express');
const reviewController = require('../controllers/review.controller');
const { reviewValidation, generalValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/search',
  reviewValidation.searchReviews,
  reviewController.searchReviews
);

router.get('/movie/:id', 
  reviewValidation.getMovieReviews,
  reviewController.getMovieReviews
);

router.get('/movie/:id/stats', 
  reviewValidation.getMovieReviews,
  reviewController.getMovieReviewStats
);

router.get('/:id',
  generalValidation.mongoId,
  reviewController.getReviewById
);

router.post('/', 
  reviewValidation.createReview,
  reviewController.createReview
);

router.patch('/:id',
  reviewValidation.updateReview,
  reviewController.updateReview
);

router.delete('/:id',
  generalValidation.mongoId,
  reviewController.deleteReview
);

module.exports = router;