/**
 * Validation middleware using express-validator
 * Defines validation rules for API endpoints
 */

const { body, param, query } = require('express-validator');

// Review validation rules
const reviewValidation = {
  getMovieReviews: [
    param('title')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage(
        'Movie title is required and must be between 1-200 characters'
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

  getTopRated: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),
    
    query('minReviews')
      .optional()
      .isInt({ min: 1 })
      .withMessage('minReviews must be a positive integer')
  ],

  createReview: [
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
      .isLength({ max: 5000 })
      .withMessage(
        'Review content is required and must not exceed 5000 characters'
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
      .isFloat({ min: 1.0, max: 5.0 })
      .withMessage('Review score must be a double between 1.0 and 5.0'),

    body('rotten_tomatoes_link')
      .optional()
      .trim()
      .matches(/^m\/[\w-]+$/)
      .withMessage(
        'Rotten Tomatoes link must be in format "m/title"'
      )
  ],

  updateReview: [
    param('id')
      .isMongoId()
      .withMessage('Invalid MongoDB ObjectId'),

    body('movie_title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Movie title must be between 1-200 characters'),

    body('critic_name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Critic name must be between 1-100 characters'),

    body('publisher_name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Publisher name must be between 1-100 characters'),

    body('review_type')
      .optional()
      .isIn(['Fresh', 'Rotten', 'Certified Fresh'])
      .withMessage(
        'Review type must be Fresh, Rotten, or Certified Fresh'
      ),

    body('review_content')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage(
        'Review content must be between 10-5000 characters'
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
      .isFloat({ min: 1.0, max: 5.0 })
      .withMessage('Review score must be a double between 1.0 and 5.0'),

    body('rotten_tomatoes_link')
      .optional()
      .trim()
      .matches(/^m\/[\w-]+$/)
      .withMessage(
        'Rotten Tomatoes link must be in format "m/title"'
      )
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