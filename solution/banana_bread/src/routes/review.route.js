/**
 * Review routes
 * Handles all review-related API endpoints
 */

const express = require('express');
const reviewController = require('../controllers/review.controller');
const { reviewValidation, generalValidation } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/reviews/search:
 *   get:
 *     summary: Search reviews by content, movie, or critic
 *     description: Performs full-text search across review content, movie titles, and critic names with pagination
 *     tags: [Reviews]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search term for review content, movie title, or critic name
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         example: "excellent direction"
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - name: title
 *         in: query
 *         description: Filter by movie title
 *         schema:
 *           type: string
 *         example: "Inception"
 *       - name: criticName
 *         in: query
 *         description: Filter by critic name
 *         schema:
 *           type: string
 *         example: "Roger Ebert"
 *     responses:
 *       '200':
 *         description: Search results with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                           example: 1
 *                         total_pages:
 *                           type: integer
 *                           example: 5
 *                         total_count:
 *                           type: integer
 *                           example: 247
 *                         per_page:
 *                           type: integer
 *                           example: 20
 *       '400':
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search',
  reviewValidation.searchReviews,
  reviewController.searchReviews
);


/**
 * @swagger
 * /api/reviews/top-rated:
 *   get:
 *     summary: Get top rated movies based on review aggregates
 *     description: Returns movies with highest Tomatometer scores, with minimum review count filter
 *     tags: [Reviews]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of movies to return
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 10
 *       - name: minReviews
 *         in: query
 *         description: Minimum number of reviews required
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 25
 *     responses:
 *       '200':
 *         description: List of top rated movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     top_rated_movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           movie_key:
 *                             type: string
 *                             example: "The Dark Knight"
 *                           tomatometer:
 *                             type: integer
 *                             example: 94
 *                           total_reviews:
 *                             type: integer
 *                             example: 287
 *                           certified_fresh:
 *                             type: boolean
 *                             example: true
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/top-rated',
  reviewValidation.getTopRated,
  reviewController.getTopRated
);

/**
 * @swagger
 * /api/reviews/movie/{title}:
 *   get:
 *     summary: Get all reviews for a specific movie
 *     description: Retrieves paginated reviews for a movie with filtering and sorting options
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/title'
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - name: sort
 *         in: query
 *         description: Sort field
 *         schema:
 *           type: string
 *           enum: [date, score]
 *           default: date
 *         example: "date"
 *       - name: order
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         example: "desc"
 *       - name: topCritic
 *         in: query
 *         description: Filter by top critics only
 *         schema:
 *           type: boolean
 *         example: true
 *       - name: reviewType
 *         in: query
 *         description: Filter by review type
 *         schema:
 *           type: string
 *           enum: [Fresh, Rotten, Certified Fresh]
 *         example: "Fresh"
 *       - name: publisher
 *         in: query
 *         description: Filter by publisher name (case-insensitive partial match)
 *         schema:
 *           type: string
 *         example: "New York Times"
 *     responses:
 *       '200':
 *         description: Movie reviews with pagination and filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                           example: 1
 *                         total_pages:
 *                           type: integer
 *                           example: 3
 *                         total_count:
 *                           type: integer
 *                           example: 45
 *                         per_page:
 *                           type: integer
 *                           example: 20
 *                     filters:
 *                       type: object
 *                       properties:
 *                         movie_title:
 *                           type: string
 *                           example: "Inception"
 *                         top_critic:
 *                           type: boolean
 *                           nullable: true
 *                         review_type:
 *                           type: string
 *                           nullable: true
 *                         publisher:
 *                           type: string
 *                           nullable: true
 *       '400':
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/movie/:title', 
  reviewValidation.getMovieReviews,
  reviewController.getMovieReviews
);

/**
 * @swagger
 * /api/reviews/movie/{title}/stats:
 *   get:
 *     summary: Get aggregated review statistics for a movie
 *     description: Returns precomputed Tomatometer scores and review statistics for a specific movie
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/title'
 *     responses:
 *       '200':
 *         description: Movie review statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MovieStats'
 *       '404':
 *         description: No reviews found for this movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/movie/:title/stats', 
  reviewValidation.getMovieReviews,
  reviewController.getMovieReviewStats
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by MongoDB ObjectId
 *     description: Retrieves detailed information for a specific review
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the review (24-character hex string)
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: "68e1321d38d13baf8f6b4bae"
 *     responses:
 *       '200':
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid ObjectId format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id',
  generalValidation.mongoId,
  reviewController.getReviewById
);

router.post('/', 
  reviewValidation.createReview,
  reviewController.createReview
);

module.exports = router;