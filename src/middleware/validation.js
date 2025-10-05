/**
 * Validation middleware using express-validator
 * Defines validation rules for API endpoints
 */

const { param, query } = require('express-validator');

// Review validation rules
const reviewValidation = {
  getMovieReviews: [
    param('title')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Movie title is required and must be between 1-200 characters'),
    
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