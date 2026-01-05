/**
 * Genre Routes
 * Handles static genre data from PostgreSQL
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
* /banana_bean/api/get_genres_list:
*  get:
*    tags[Genres]
*    summary: Given a name of an actor extract all the records that matches the given name
*     responses:
*       200:
*         description: List of genres
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/GenreArray'
*       404:
*         description: List of genres not found
*/
router.get('/get_genres_list', proxyRequest)
