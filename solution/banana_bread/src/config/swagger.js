/**
 * Swagger/OpenAPI Configuration for Bump.sh
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Banana Bread API',
      version: '1.3.0',
      description: 'Banana Bread is the express MongoDB API for the ' +
        'Ripe Bananas site, it provides access to movie reviews and chats'
    },
    servers: [
      {
        url: process.env.CORS_ORIGIN,
        description: process.env.NODE_ENV === 'development'
          ? 'Development server'
          : 'Production server'
      }
    ],
    components: {
      schemas: {
        Review: {
          type: 'object',
          required: [
            'movie_title',
            'review_score',
            'review_type',
            'review_content'
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '68e1321d38d13baf8f6b4bae'
            },
            movie_title: {
              type: 'string',
              description: 'Title of the movie being reviewed',
              example: 'Inception'
            },
            critic_name: {
              type: ['string', 'null'],
              description: 'Name of the critic if applicable',
              example: 'Roger Ebert'
            },
            top_critic: {
              type: 'boolean',
              description: 'Whether the critic is a top critic',
              example: true
            },
            publisher_name: {
              type: ['string', 'null'],
              description: 'Name of the publication if applicable',
              example: 'Chicago Sun-Times'
            },
            review_type: {
              type: 'string',
              enum: ['Fresh', 'Rotten', 'Certified Fresh'],
              description: 'Type of review rating',
              example: 'Fresh'
            },
            review_score: {
              type: 'number',
              description: 'Numeric score from 1.0 to 5.0',
              example: 2.5
            },
            review_date: {
              type: 'string',
              format: 'date',
              description: 'Date of the review',
              example: '2023-12-20'
            },
            review_content: {
              type: 'string',
              description: 'Full text content of the review',
              example: 'This film delivers an exceptional cinematic ' +
                'experience...'
            },
            rotten_tomatoes_link: {
              type: 'string',
              format: 'uri',
              description: 'Partial Rotten Tomatoes URL for the review',
              example: 'm/inception'
            }
          }
        },
        MovieStats: {
          type: 'object',
          properties: {
            movie_title: {
              type: 'string',
              example: 'Inception'
            },
            statistics: {
              type: 'object',
              properties: {
                bananameter: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 100,
                  description: 'Overall fresh percentage',
                  example: 87
                },
                top_critic_score: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 100,
                  description: 'Top critics fresh percentage',
                  example: 92
                },
                certified_fresh: {
                  type: 'boolean',
                  description: 'Whether the movie is certified fresh',
                  example: true
                },
                total_reviews: {
                  type: 'integer',
                  description: 'Total number of reviews',
                  example: 156
                },
                positive_reviews: {
                  type: 'integer',
                  description: 'Number of fresh reviews',
                  example: 136
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Internal server error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      },
      parameters: {
        Title: {
          name: 'title',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Movie title',
          example: 'Inception'
        },
        Page: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          description: 'Page number for pagination'
        },
        Limit: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
          },
          description: 'Number of items per page'
        }
      }
    },
    tags: [
      {
        name: 'Reviews',
        description: 'Movie review operations'
      },
      {
        name: 'Chat',
        description: 'Topic-based chat functionality'
      },
      {
        name: 'System',
        description: 'System health and information endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  options
};