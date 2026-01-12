/**
 * Oscar Routes
 * Handles static oscar data from PostgreSQL
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
 *     tags: [Oscars]
 *     summary: Extract a Page of Oscar Awards matching specific search
 *     description: Select a Page of Oscar Awards that corresponds to a certain search, blank fields be omitted by the search
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the awarded actor or crew member
 *         schema:
 *           type: string
 *       - name: film_name
 *         in: query
 *         description: Name of the awarded film
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         description: Oscar Award category
 *         schema:
 *           type: string
 *       - name: min_year_film
 *         in: query
 *         description: Year of movie release, minimum
 *         schema:
 *           type: integer
 *       - name: max_year_film
 *         in: query
 *         description: Year of movie release, maximum, leave blank if not needed
 *         schema:
 *           type: integer
 *       - name: min_year_ceremony
 *         in: query
 *         description: Year of ceremony, Minimum
 *         schema:
 *           type: number
 *           format: integer
 *       - name: max_year_ceremony
 *         in: query
 *         description: Year of ceremony, maximum, leave blank if not needed
 *         schema:
 *           type: number
 *           format: integer
 *       - name: min_ceremony
 *         in: query
 *         description: Minimum ceremony to search
 *         schema:
 *           type: integer
 *       - name: max_ceremony
 *         in: query
 *         description: Maximum ceremony to search, leave blank if not needed
 *         schema:
 *           type: integer
 *       - name: winner
 *         in: query
 *         description: Oscar Award winner, true or false
 *         schema:
 *           type: boolean
 *       - name: sort_by
 *         in: query
 *         description: Sort field for the query
 *         schema:
 *           type: string
 *       - name: sort_direction
 *         in: query
 *         description: Sort direction, case insensitive
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
 *         description: Page of Oscar Awards matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagedOscar'
 *       404:
 *         description: Movies not found
 */
router.get('/get_oscar_awards', proxyRequest);

module.exports = router;
