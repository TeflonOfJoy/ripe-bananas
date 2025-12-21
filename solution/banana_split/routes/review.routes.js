/**
 * Review Routes
 * Handles dynamic review data
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const MONGODB_SERVER = process.env.BANANA_BREAD_URL || 'http://localhost:3001';

// Helper function to proxy requests
const proxyRequest = async (req, res, next) => {
  try {
    const url = `${MONGODB_SERVER}${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // Backend responded with error
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // No response from backend
      res.status(503).json({
        success: false,
        message: 'MongoDB service unavailable'
      });
    } else {
      next(error);
    }
  }
};

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
router.get('/search', proxyRequest);

/**
 * @swagger
 * /api/reviews/movie/{id}:
 *   get:
 *     summary: Get all reviews for a specific movie
 *     description: Retrieves paginated reviews for a movie with
 *       filtering and sorting options
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Movie ID from PostgreSQL database
 *         schema:
 *           type: integer
 *         example: 123
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
 *         description: Filter by publisher name
 *           (case-insensitive partial match)
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
 *                         movie_id:
 *                           type: integer
 *                           example: 123
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
router.get('/movie/:id', proxyRequest);

/**
 * @swagger
 * /api/reviews/movie/{id}/stats:
 *   get:
 *     summary: Get aggregated review statistics for a movie
 *     description: Returns precomputed Bananameter scores and review
 *       statistics for a specific movie
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Movie ID from PostgreSQL database
 *         schema:
 *           type: integer
 *         example: 123
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
router.get('/movie/:id/stats', proxyRequest);

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
router.get('/:id', proxyRequest);

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
 *               - movie_id
 *               - movie_title
 *               - review_type
 *               - review_date
 *             properties:
 *               rotten_tomatoes_link:
 *                 type: string
 *                 description: Slug to the review on Rotten Tomatoes
 *                 example: "m/inception"
 *               movie_id:
 *                 type: integer
 *                 description: Movie ID from PostgreSQL database
 *                 example: 123
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
 *                 type: number
 *                 format: double
 *                 minimum: 1.0
 *                 maximum: 5.0
 *                 nullable: true
 *                 description: Optional numerical score
 *                 example: "3.5"
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
 *       '409':
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
router.post('/', proxyRequest);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update an existing review
 *     description: Updates a review by Id with the provided fields.
 *       Only provided fields will be updated.
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the review
 *           (24-character hex string)
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: "68e1321d38d13baf8f6b4bae"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotten_tomatoes_link:
 *                 type: string
 *                 description: Rotten Tomatoes path in format "m/title"
 *                 example: "m/inception"
 *               movie_id:
 *                 type: integer
 *                 description: Movie ID from PostgreSQL database
 *                 example: 123
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
 *                 type: number
 *                 format: double
 *                 minimum: 1.0
 *                 maximum: 5.0
 *                 description: Numerical score between 1.0 and 5.0
 *                 example: 4.5
 *               review_date:
 *                 type: string
 *                 format: date
 *                 description: Date the review was published
 *                 example: "2010-07-16"
 *               review_content:
 *                 type: string
 *                 description: Full text content of the review
 *                 example: "An updated masterpiece of cinema."
 *     responses:
 *       '200':
 *         description: Review successfully updated
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
 *                   example: "Review updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid request data or validation error
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
 *                   example: ["Review content must be between 10-5000
 *                     characters"]
 *       '404':
 *         description: Review not found
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
 *                   example: "Review not found"
 *       '500':
 *         description: Internal server error while updating review
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
 *                   example: "Internal server error while updating
 *                     review"
 */
router.patch('/:id', proxyRequest);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Permanently deletes a review by its Id
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the review to delete
 *           (24-character hex string)
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: "68e1321d38d13baf8f6b4bae"
 *     responses:
 *       '200':
 *         description: Review successfully deleted
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
 *                   example: "Review deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid review Id format
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
 *                   example: "Invalid review Id format"
 *       '404':
 *         description: Review not found
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
 *                   example: "Review not found"
 *       '500':
 *         description: Internal server error while deleting review
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
 *                   example: "Internal server error while deleting
 *                     review"
 */
router.delete('/:id', proxyRequest);

module.exports = router;

