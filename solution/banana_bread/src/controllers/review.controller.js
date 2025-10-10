/**
 * Review Controller
 * Handles review-related operations for movie reviews
 */

const { Review, ReviewAggregate } = require('../models');
const { validationResult } = require('express-validator');

class ReviewController {
/**
 * Get reviews for a specific movie
 * GET /api/reviews/movie/:title
 */
async getMovieReviews(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let { title } = req.params;
    const {
      page = 1,
      limit = 20,
      sort = 'date',
      order = 'desc',
      topCritic,
      reviewType,
      publisher
    } = req.query;

    // Clean and normalize the movie title
    title = decodeURIComponent(title).trim();
    
    console.log('Searching for movie:', title);

    // Use case-insensitive regex instead of exact match
    const filter = { 
      movie_title: new RegExp(`^${escapeRegex(title)}$`, 'i') 
    };
    
    console.log('MongoDB filter:', filter);
    
    if (topCritic !== undefined) {
      filter.top_critic = topCritic === 'true';
    }
    
    if (reviewType) {
      filter.review_type = reviewType;
    }
    
    if (publisher) {
      filter.publisher_name = new RegExp(publisher, 'i');
    }

    // Build sort query
    const sortQuery = {};
    const sortField = sort === 'date' ? 'review_date' : 
                    sort === 'score' ? 'review_score' :
                    'review_date';
    sortQuery[sortField] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .select(
          'movie_title critic_name top_critic publisher_name ' +
          'review_type review_score review_date review_content created_at'
        )
        .lean(),
      Review.countDocuments(filter)
    ]);

    console.log(`Found ${reviews.length} reviews for "${title}"`);

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
          movie_title: title,
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

    if (!review) {
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
 * GET /api/reviews/movie/:title/stats
 */
async getMovieReviewStats(req, res) {
  try {
    let { title } = req.params;

    title = decodeURIComponent(title).trim();
    
    console.log('Looking for stats for movie:', title);

    let stats = await ReviewAggregate.findOne({ 
      movie_key: new RegExp(`^${escapeRegex(title)}$`, 'i') 
    }).lean();

    if (!stats) {
      console.log('No precomputed stats found, calculating on-demand...');
      
      const reviewStats = await Review.aggregate([
        { $match: { movie_title: new RegExp(`^${escapeRegex(title)}$`, 'i') } },
        {
          $group: {
            _id: '$movie_title', // Keep the original case from DB
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
        
        // Cache the computed stats using the original case from database
        stats = await ReviewAggregate.updateMovieStats(movieStats._id, {
          total_reviews: movieStats.total_reviews,
          positive_reviews: movieStats.fresh_reviews,
          top_critic_total: movieStats.top_critic_total,
          top_critic_positive: movieStats.top_critic_fresh
        });
      }
    } else {
      console.log('Found precomputed stats');
    }

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: `No reviews found for movie: ${title}`
      });
    }

    res.json({
      success: true,
      data: {
        movie_title: stats.movie_key,
        statistics: {
          bananameter: stats.bananameter,
          top_critic_score: stats.top_critic_score,
          audience_score: stats.audience_score,
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
    if (!errors.isEmpty()) {
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

    if (query) {
      filter.$or = [
        { review_content: new RegExp(query, 'i') },
        { movie_title: new RegExp(query, 'i') },
        { critic_name: new RegExp(query, 'i') }
      ];
    }

    if (title) {
      filter.movie_title = new RegExp(title, 'i');
    }

    if (criticName) {
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
 * Get top rated movies based on aggregates
 * GET /api/reviews/top-rated
 */
async getTopRated(req, res) {
  try {
    const { limit = 20, minReviews = 10 } = req.query;

    const topMovies = await ReviewAggregate.getTopRated(
      parseInt(limit),
      parseInt(minReviews)
    );

    res.json({
      success: true,
      data: {
        top_rated_movies: topMovies.map(movie => ({
          movie_key: movie.movie_key,
          bananameter: movie.bananameter,
          total_reviews: movie.total_reviews,
          certified_fresh: movie.certified_fresh
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching top rated movies'
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

      if (!existingReview) {
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
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = new ReviewController();