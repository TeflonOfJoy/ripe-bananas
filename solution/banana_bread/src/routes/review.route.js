/**
 * Review routes
 * Handles all review-related API endpoints
 */

const express = require('express');
const reviewController = require('../controllers/review.controller');
const {
  reviewValidation,
  generalValidation
} = require('../middleware/validation');

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

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new movie review
 *     description: Creates a new review in MongoDB with the provided
 *       review data
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rotten_tomatoes_link
 *               - movie_title
 *               - critic_name
 *               - publisher_name
 *               - review_type
 *               - review_date
 *               - review_content
 *             properties:
 *               rotten_tomatoes_link:
 *                 type: string
 *                 description: URL to the review on Rotten Tomatoes
 *                 example: "https://www.rottentomatoes.com/m/inception/reviews"
 *               movie_title:
 *                 type: string
 *                 description: Title of the movie being reviewed
 *                 example: "Inception"
 *               critic_name:
 *                 type: string
 *                 description: Name of the critic who wrote the review
 *                 example: "Roger Ebert"
 *               top_critic:
 *                 type: boolean
 *                 description: Whether the critic is a top critic
 *                 default: false
 *                 example: true
 *               publisher_name:
 *                 type: string
 *                 description: Name of the publication
 *                 example: "Chicago Sun-Times"
 *               review_type:
 *                 type: string
 *                 enum: [Fresh, Rotten, Certified Fresh]
 *                 description: Type of review rating
 *                 example: "Fresh"
 *               review_score:
 *                 type: string
 *                 nullable: true
 *                 description: Optional numerical score
 *                 example: "75"
 *               review_date:
 *                 type: string
 *                 format: date
 *                 description: Date the review was published
 *                 example: "2010-07-16"
 *               review_content:
 *                 type: string
 *                 description: Full text content of the review
 *                 example: "A masterpiece of modern cinema that
 *                   challenges viewers with its complex narrative."
 *     responses:
 *       '200':
 *         description: Review successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Review created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Schema validation failed - invalid or missing
 *           required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Schema validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["review_content is required",
 *                     "movie_title is required"]
 *       '404':
 *         description: Duplicate review - a review with these details
 *           already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "A review with these details already exists"
 *       '500':
 *         description: Internal server error while creating review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error while creating review"
 */
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