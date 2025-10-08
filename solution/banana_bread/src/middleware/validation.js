/**
 * Validation middleware using express-validator
 * Defines validation rules for API endpoints
 */

const { body, param, query } = require('express-validator');

// Review validation rules
const reviewValidation = {
  getMovieReviews: [
    param('id')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage(
        'Movie ID is required and must be a positive integer'
      ),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),

    query('sort')
      .optional()
      .isIn(['date', 'score'])
      .withMessage('Sort must be either "date" or "score"'),

    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be either "asc" or "desc"'),

    query('topCritic')
      .optional()
      .isBoolean()
      .withMessage('topCritic must be a boolean'),

    query('reviewType')
      .optional()
      .isIn(['Fresh', 'Rotten', 'Certified Fresh'])
      .withMessage('reviewType must be Fresh, Rotten, or Certified Fresh'),

    query('publisher')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Publisher name must be less than 100 characters')
  ],

  searchReviews: [
    query('query')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be between 2-100 characters'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),

    query('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Movie title must be less than 200 characters'),

    query('criticName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Critic name must be less than 100 characters')
  ],

  createReview: [
    body('movie_id')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage(
        'Movie ID is required and must be a positive integer'
      ),

    body('movie_title')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage(
        'Movie title is required and must be between 1-200 characters'
      ),

    body('critic_name')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        'Critic name is required and must be between 1-100 characters'
      ),

    body('publisher_name')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        'Publisher name is required and must be between 1-100 characters'
      ),

    body('review_type')
      .notEmpty()
      .isIn(['Fresh', 'Rotten', 'Certified Fresh'])
      .withMessage(
        'Review type must be Fresh, Rotten, or Certified Fresh'
      ),

    body('review_content')
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage(
        'Review content is required and must be between 10-5000 characters'
      ),

    body('review_date')
      .optional()
      .isISO8601()
      .withMessage('Review date must be a valid ISO date'),

    body('top_critic')
      .optional()
      .isBoolean()
      .withMessage('Top critic must be a boolean'),

    body('review_score')
      .optional()
      .custom((value) => {
        if (value !== null && value !== undefined) {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0 || numValue > 10) {
            throw new Error('Review score must be a number between 0-10');
          }
        }
        return true;
      }),

    body('rotten_tomatoes_link')
      .optional()
      .trim()
      .isURL()
      .withMessage('Rotten Tomatoes link must be a valid URL'),

    body('movie_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Movie ID must be a positive integer'),

    body('movie_title')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Film reference must be less than 100 characters')
  ]
};

// General validation rules
const generalValidation = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid MongoDB ObjectId')
  ]
};

module.exports = {
  reviewValidation,
  generalValidation
};