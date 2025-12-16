/**
 * Review Routes
 * Handles dynamic review data
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const MONGODB_SERVER = process.env.MONGODB_SERVER_URL || 'http://localhost:3001';

// Helper function to proxy requests
const proxyRequest = async (req, res, next) => {
  try {
    const url = `${MONGODB_SERVER}${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      params: req.query,
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

// Search reviews
router.get('/search', proxyRequest);

// Get top rated reviews
router.get('/top-rated', proxyRequest);

// Get reviews by movie title
router.get('/movie/:title', proxyRequest);

// Get movie statistics
router.get('/movie/:title/stats', proxyRequest);

// Get single review by ID
router.get('/:id', proxyRequest);

// Create new review
router.post('/', proxyRequest);

// Update review
router.patch('/:id', proxyRequest);

// Delete review
router.delete('/:id', proxyRequest);

module.exports = router;
