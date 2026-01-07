/**
 * Movie Routes
 * Handles static movie data from PostgreSQL
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
 * /api/movies/get_movies:
 *   get:
 *     tags: [Movies]
 *     summary: Extract a Page of movies matching specific search
 *     description: Select a Page of movies that corresponds to a certain search, blank fields be omitted by the search
 *     parameters:
 *       - name: movie_name
 *         in: query
 *         description: Name of the movie
 *         schema:
 *           type: string
 *       - name: genres
 *         in: query
 *         description: List of genres to search the movie with
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - name: min_year
 *         in: query
 *         description: Year of release, minimum
 *         schema:
 *           type: integer
 *       - name: max_year
 *         in: query
 *         description: Year of release, maximum, leave blank if not needed
 *         schema:
 *           type: integer
 *       - name: min_rating
 *         in: query
 *         description: Minimum rating to search
 *         schema:
 *           type: number
 *           format: float
 *       - name: max_rating
 *         in: query
 *         description: Maximum rating to search, leave blank if not needed
 *         schema:
 *           type: number
 *           format: float
 *       - name: min_duration
 *         in: query
 *         description: Minimum duration to search
 *         schema:
 *           type: integer
 *       - name: max_duration
 *         in: query
 *         description: Maximum duration to search, leave blank if not needed
 *         schema:
 *           type: integer
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
 *         description: Page of movies matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagedMovies'
 *       404:
 *         description: Movies not found
 */
router.get('/get_movies', proxyRequest);

/**
 * @swagger
 * /api/movies/get_movie_details/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Given a Movie Id extract all the informations regarding that Movie
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the movie you want to search
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get('/get_movie_details/:id', proxyRequest);

/**
 * @swagger
 * /api/movies/get_movies_with_actor:
 *   get:
 *     tags: [Movies]
 *     summary: Given an Actor Id extract all the movies in which that actor appears
 *     parameters:
 *       - name: actor_id
 *         in: query
 *         required: true
 *         description: Id of the actor
 *         schema:
 *           type: integer
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
 *         description: Page of movies featuring the actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagedMovies'
 *       404:
 *         description: Movies not found
 */
router.get('/get_movies_with_actor', proxyRequest);

module.exports = router;
