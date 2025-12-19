/**
 * Chat Routes
 * Handles chat message history
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
        message: 'Chat service unavailable'
      });
    } else {
      next(error);
    }
  }
};

// Check username availability
router.get('/username/:username', proxyRequest);

// Get message history for a room
router.get('/:room', proxyRequest);

module.exports = router;
