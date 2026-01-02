/**
 * Swagger/OpenAPI Configuration for Banana Split
 * Main routing server API documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Banana Split API',
      version: '1.0.0',
      description: 'Main routing server for the Ripe Bananas movie aggregation site. ' +
        'Routes requests to MongoDB (reviews, chat) and PostgreSQL (movies, actors) backends.'
    },
    servers: [
      {
        url: process.env.CORS_ORIGIN,
        description: process.env.NODE_ENV === 'development'
          ? 'Local development'
          : 'Heroku remote'
      }
    ],
    components: {
      schemas: {
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId' },
            rotten_tomatoes_link: { type: 'string' },
            movie_id: { type: 'integer', description: 'Movie ID from PostgreSQL' },
            movie_title: { type: 'string' },
            critic_name: { type: 'string' },
            top_critic: { type: 'boolean' },
            publisher_name: { type: 'string' },
            review_type: { type: 'string', enum: ['Fresh', 'Rotten', 'Certified Fresh'] },
            review_score: { type: 'number', format: 'double', minimum: 1.0, maximum: 5.0 },
            review_date: { type: 'string', format: 'date' },
            review_content: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        MovieStats: {
          type: 'object',
          properties: {
            movie_id: { type: 'integer', example: 123 },
            statistics: {
              type: 'object',
              properties: {
                bananameter: { type: 'integer', minimum: 0, maximum: 100, example: 87 },
                top_critic_score: { type: 'integer', minimum: 0, maximum: 100, example: 92 },
                certified_fresh: { type: 'boolean', example: true },
                total_reviews: { type: 'integer', example: 156 },
                positive_reviews: { type: 'integer', example: 136 }
              }
            }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            room: { type: 'string' },
            username: { type: 'string' },
            message: { type: 'string' },
            colour: { type: 'string' }
          }
        },
        BasicMovie: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Movie ID' },
            title: { type: 'string', description: 'Movie title' },
            genres: { type: 'array', items: { type: 'string' }, description: 'List of genres' },
            year: { type: 'integer', description: 'Release year' },
            rating: { type: 'number', format: 'float', description: 'Movie rating' },
            duration: { type: 'integer', description: 'Duration in minutes' }
          }
        },
        PagedMovies: {
          type: 'object',
          properties: {
            content: {
              type: 'array',
              items: { $ref: '#/components/schemas/BasicMovie' },
              description: 'Array of movies'
            },
            totalPages: { type: 'integer', description: 'Total number of pages' },
            totalElements: { type: 'integer', description: 'Total number of movies' },
            number: { type: 'integer', description: 'Current page number' },
            size: { type: 'integer', description: 'Page size' }
          }
        },
        Movie: {
          type: 'object',
          description: 'Full movie details',
          properties: {
            id: { type: 'integer', description: 'Movie ID' },
            title: { type: 'string', description: 'Movie title' },
            genres: { type: 'array', items: { type: 'string' }, description: 'List of genres' },
            year: { type: 'integer', description: 'Release year' },
            rating: { type: 'number', format: 'float', description: 'Movie rating' },
            duration: { type: 'integer', description: 'Duration in minutes' },
            description: { type: 'string', description: 'Movie synopsis' },
            director: { type: 'string', description: 'Director name' },
            cast: { type: 'array', items: { type: 'string' }, description: 'List of actors' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Internal server error' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      parameters: {
        Title: {
          name: 'title',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Movie title',
          example: 'Inception'
        },
        Page: {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number for pagination'
        },
        Limit: {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Number of items per page'
        }
      }
    },

    tags: [
      { name: 'Reviews', description: 'Movie review operations (MongoDB)' },
      { name: 'Chat', description: 'Real-time chat functionality (MongoDB)' },
      { name: 'Movies', description: 'Movie data operations (PostgreSQL)' }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  options
};
