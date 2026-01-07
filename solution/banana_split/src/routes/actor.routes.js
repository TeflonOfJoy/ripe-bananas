/**
 * Actor Routes
 * Handles static actor data from PostgreSQL
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPRINGBOOT_SERVER = process.env.BANANA_BEAN_URL;

// Helper function to proxy requests
const proxyRequest = async (req, res, next) => {
  try {
    const url = `${SPRINGBOOT_SERVER}${req.originalUrl}`;

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
 * /api/actors/get_actors:
 *   get:
 *     tags:
 *       - Actors
 *     summary: Given a name of an actor extract all the records that matches the given name
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         description: Name of the actor to search
 *         schema:
 *           type: string
 *       - name: sort_by
 *         in: query
 *         description: Sort field for the query
 *         schema:
 *           type: string
 *       - name: page_num
 *         in: query
 *         description: Number of page to retrieve, if > 0 retrieve the next page of the same search
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: page_sz
 *         in: query
 *         description: Number of entries per page
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         description: Page of actors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagedActors'
 *       404:
 *         description: Actor not found
 */
router.get('/get_actors', proxyRequest)

module.exports = router;
