/**
 * Movie Routes
 * Handles static movie data from PostgreSQL
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPRINGBOOT_SERVER = process.env.SPRINGBOOT_SERVER_URL || 'http://localhost:8080';

// Helper function to proxy requests
const proxyRequest = async (req, res, next) => {
  try {
    const url = `${SPRINGBOOT_SERVER}${req.originalUrl}`;

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
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(503).json({
        success: false,
        message: 'Spring Boot service unavailable'
      });
    } else {
      next(error);
    }
  }
};

// Get all movies (with pagination)
router.get('/', proxyRequest);

// Search movies
router.get('/search', proxyRequest);

// Get movie by ID
router.get('/:id', proxyRequest);

// Get movie cast
router.get('/:id/cast', proxyRequest);

// Get movie awards
router.get('/:id/awards', proxyRequest);

// Create new movie
router.post('/', proxyRequest);

// Update movie
router.put('/:id', proxyRequest);

// Delete movie
router.delete('/:id', proxyRequest);

module.exports = router;
