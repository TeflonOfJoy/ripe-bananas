/**
 * Actor Routes
 * Handles static actor data from PostgreSQL
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

/**
 * @swagger
 * /api/actors:
 *   get:
 *     tags: [Actors]
 *     summary: Get all actors with pagination
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of actors
 */
router.get('/', proxyRequest);

module.exports = router;
