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
        url: process.env.CORS_ORIGIN || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'development'
          ? 'Development server'
          : 'Production server'
      }
    ],
    components: {
      schemas: {
        Review: {
          type: 'object',
          properties: {
            movie_title: { type: 'string' },
            review_type: { type: 'string', enum: ['Fresh', 'Rotten', 'Certified Fresh'] },
            review_score: { type: 'number' },
            review_content: { type: 'string' }
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
        Movie: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            year: { type: 'integer' },
            genre: { type: 'string' }
          }
        },
        Actor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            birthdate: { type: 'string', format: 'date' }
          }
        }
      }
    },
    tags: [
      { name: 'Reviews', description: 'Movie review operations (MongoDB)' },
      { name: 'Chat', description: 'Real-time chat functionality (MongoDB)' },
      { name: 'Movies', description: 'Movie data operations (PostgreSQL)' },
      { name: 'Actors', description: 'Actor data operations (PostgreSQL)' }
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
