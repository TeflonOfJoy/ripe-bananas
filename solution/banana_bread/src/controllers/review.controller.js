/**
 * Review Controller
 * Handles review-related operations for movie reviews
 */

const { Review, ReviewAggregate } = require('../models');
const { validationResult } = require('express-validator');

class ReviewController {
  /**
   * Get reviews for a specific movie
   * GET /api/reviews/movie/:id
   */
  async getMovieReviews(req, res) {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty() === false) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const movieId = parseInt(id);
      const {
        page = 1,
        limit = 20,
        sort = 'date',
        order = 'desc',
        topCritic,
        reviewType,
        publisher
      } = req.query;

      console.log('Searching for movie_id:', movieId);

      const filter = { movie_id: movieId };

      if (topCritic !== undefined) {
        filter.top_critic = topCritic === 'true';
      }

      if (reviewType !== undefined) {
        filter.review_type = reviewType;
      }

      if (publisher !== undefined) {
        filter.publisher_name = new RegExp(publisher, 'i');
      }

      // Build sort query
      const sortQuery = {};
      let sortField = 'review_date';
      if (sort === 'date') {
        sortField = 'review_date';
      } else if (sort === 'score') {
        sortField = 'review_score';
      }
      sortQuery[sortField] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reviews, totalCount] = await Promise.all([
        Review.find(filter)
          .sort(sortQuery)
          .skip(skip)
          .limit(parseInt(limit))
          .select(
            'movie_id movie_title critic_name top_critic publisher_name ' +
            'review_type review_score review_date review_content'
          )
          .lean(),
        Review.countDocuments(filter)
      ]);

      console.log(`Found ${reviews.length} reviews for movie_id: ${movieId}`);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          reviews: reviews.map(review => ({
            ...review,
            review_content: review.review_content
              ? review.review_content.substring(0, 300) + '...'
              : ''
          })),
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_count: totalCount,
            per_page: parseInt(limit)
          },
          filters: {
            movie_id: movieId,
            top_critic: topCritic,
            review_type: reviewType,
            publisher
          }
        }
      });

    } catch (error) {
      console.error('Error fetching movie reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching reviews'
      });
    }
  }

  /**
   * Get a single review by ID
   * GET /api/reviews/:id
   */
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id).lean();

      if (review === null) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        data: { review }
      });

    } catch (error) {
      console.error('Error fetching review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching review'
      });
    }
  }

  /**
   * Get aggregated review statistics for a movie
   * GET /api/reviews/movie/:id/stats
   */
  async getMovieReviewStats(req, res) {
    try {
      const { id } = req.params;
      const movieId = parseInt(id);

      console.log('Looking for stats for movie_id:', movieId);

      let stats = await ReviewAggregate.findOne({ movie_id: movieId }).lean();

      if (stats === null) {
        console.log('No precomputed stats found, calculating on-demand...');

        const reviewStats = await Review.aggregate([
          { $match: { movie_id: movieId } },
          {
            $group: {
              _id: '$movie_id',
              movie_title: { $first: '$movie_title' },
              total_reviews: { $sum: 1 },
              fresh_reviews: {
                $sum: {
                  $cond: [
                    { $in: ['$review_type', ['Fresh', 'Certified Fresh']] },
                    1,
                    0
                  ]
                }
              },
              top_critic_total: {
                $sum: { $cond: ['$top_critic', 1, 0] }
              },
              top_critic_fresh: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        '$top_critic',
                        { $in: ['$review_type', ['Fresh', 'Certified Fresh']] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              },
              latest_review: { $max: '$review_date' }
            }
          }
        ]);

        if (reviewStats.length > 0) {
          const movieStats = reviewStats[0];
          console.log('Calculated stats:', movieStats);

          stats = await ReviewAggregate.updateMovieStats(movieId, {
            movie_title: movieStats.movie_title,
            total_reviews: movieStats.total_reviews,
            positive_reviews: movieStats.fresh_reviews,
            top_critic_total: movieStats.top_critic_total,
            top_critic_positive: movieStats.top_critic_fresh
          });
        }
      } else {
        console.log('Found precomputed stats');
      }

      if (stats === null) {
        return res.status(404).json({
          success: false,
          message: `No reviews found for movie_id: ${movieId}`
        });
      }

      res.json({
        success: true,
        data: {
          movie_id: stats.movie_id,
          movie_title: stats.movie_title,
          statistics: {
            bananameter: stats.bananameter,
            top_critic_score: stats.top_critic_score,
            certified_fresh: stats.certified_fresh,
            total_reviews: stats.total_reviews,
            positive_reviews: stats.positive_reviews,
            top_critic_total: stats.top_critic_total,
            top_critic_positive: stats.top_critic_positive,
            last_updated: stats.last_updated
          }
        }
      });

    } catch (error) {
      console.error('Error fetching movie stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching statistics'
      });
    }
  }

  /**
   * Search reviews by content
   * GET /api/reviews/search
   */
  async searchReviews(req, res) {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty() === false) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        query,
        page = 1,
        limit = 20,
        title,
        criticName
      } = req.query;

      // Build search filter
      const filter = {};

      if (query !== undefined) {
        filter.$or = [
          { review_content: new RegExp(query, 'i') },
          { movie_title: new RegExp(query, 'i') },
          { critic_name: new RegExp(query, 'i') }
        ];
      }

      if (title !== undefined) {
        filter.movie_title = new RegExp(title, 'i');
      }

      if (criticName !== undefined) {
        filter.critic_name = new RegExp(criticName, 'i');
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reviews, totalCount] = await Promise.all([
        Review.find(filter)
          .sort({ review_date: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .select(
            'movie_title critic_name publisher_name review_type ' +
            'review_date review_content'
          )
          .lean(),
        Review.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          reviews: reviews.map(review => ({
            ...review,
            review_content: review.review_content.substring(0, 200) + '...'
          })),
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_count: totalCount,
            per_page: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Error searching reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while searching reviews'
      });
    }
  }



  /**
   * Create a review
   * POST /api/reviews
   */
  async createReview(req, res) {
    try {
      const reviewData = {
        ...req.body,
        review_date: req.body.review_date || new Date(),
        top_critic: req.body.top_critic || false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const review = await Review.create(reviewData);

      res.json({
        success: true,
        message: 'Review created successfully',
        data: {
          review: review.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error creating review:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors)
          .map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Schema validation failed',
          errors: validationErrors
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A review with these details already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while creating review'
      });
    }
  }

  /**
   * Update a review
   * PUT /api/reviews/:id
   */
  async updateReview(req, res) {
    try {
      const { id } = req.params;

      // Check if review exists
      const existingReview = await Review.findById(id);

      if (existingReview === null) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Update review with provided fields
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: {
          review: updatedReview.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error updating review:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors)
          .map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Schema validation failed',
          errors: validationErrors
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid review ID format'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating review'
      });
    }
  }

  /**
   * Delete a review
   * DELETE /api/reviews/:id
   */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      // Check if review exists and delete it
      const deletedReview = await Review.findByIdAndDelete(id);

      if (deletedReview === null) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully',
        data: {
          review: deletedReview.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error deleting review:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid review ID format'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting review'
      });
    }
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = new ReviewController();