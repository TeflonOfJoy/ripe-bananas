/**
 * Chat Routes
 * Handles chat message history
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

/**
 * @swagger
 * /api/chat/username/{username}:
 *   get:
 *     tags: [Chat]
 *     summary: Check username availability
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Username availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 available:
 *                   type: boolean
 */
router.get('/username/:username', proxyRequest);

/**
 * @swagger
 * /api/chat/{room}:
 *   get:
 *     tags: [Chat]
 *     summary: Get message history for a room
 *     parameters:
 *       - name: room
 *         in: path
 *         required: true
 *         description: Room/topic name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat message history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 */
router.get('/:room', proxyRequest);

module.exports = router;
