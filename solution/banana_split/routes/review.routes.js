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
 *     tags: [Reviews]
 *     summary: Search reviews
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching reviews
 */
router.get('/search', proxyRequest);

/**
 * @swagger
 * /api/reviews/top-rated:
 *   get:
 *     tags: [Reviews]
 *     summary: Get top rated reviews
 *     responses:
 *       200:
 *         description: List of top rated reviews
 */
router.get('/top-rated', proxyRequest);

/**
 * @swagger
 * /api/reviews/movie/{title}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews by movie title
 *     parameters:
 *       - name: title
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews for the movie
 */
router.get('/movie/:title', proxyRequest);

/**
 * @swagger
 * /api/reviews/movie/{title}/stats:
 *   get:
 *     tags: [Reviews]
 *     summary: Get movie statistics
 *     parameters:
 *       - name: title
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie statistics including bananameter score
 */
router.get('/movie/:title/stats', proxyRequest);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get single review by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get('/:id', proxyRequest);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/', proxyRequest);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update review
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.patch('/:id', proxyRequest);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete review
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:id', proxyRequest);

module.exports = router;
