/**
 * Review model for movie reviews
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rotten_tomatoes_link: {
    type: String,
    required: false,
    trim: true,
    index: true
  },

  movie_title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  critic_name: {
    type: String,
    required: false,
    trim: true,
    index: true
  },

  // Top critic flag for filtering and aggregations
  top_critic: {
    type: Boolean,
    required: false,
    default: false,
    index: true
  },

  publisher_name: {
    type: String,
    required: false,
    trim: true,
    index: true
  },

  review_type: {
    type: String,
    required: true,
    enum: ['Fresh', 'Rotten', 'Certified Fresh'],
    index: true
  },

  review_score: {
    type: Number,
    min: 0,
    max: 100,
    index: true,
    sparse: true,
    default: null,
    required: true
  },

  review_date: {
    type: Date,
    required: true,
    index: true
  },

  review_content: {
    type: String,
    required: false
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'reviews',
  timestamps: false
});

// Compound indexes for common query patterns
reviewSchema.index({ movie_title: 1, review_date: -1 });
reviewSchema.index({ movie_title: 1, top_critic: 1 }); 
reviewSchema.index({ movie_title: 1, review_type: 1 });
reviewSchema.index({ critic_name: 1, review_date: -1 }); 
reviewSchema.index({ publisher_name: 1, review_date: -1 });

// Pre-save middleware to update timestamp
reviewSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Instance methods
reviewSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    movie_title: this.movie_title,
    critic_name: this.critic_name,
    top_critic: this.top_critic,
    publisher_name: this.publisher_name,
    review_type: this.review_type,
    review_score: this.review_score,
    review_date: this.review_date,
    review_content: this.review_content.substring(0, 500) + '...',
    created_at: this.created_at
  };
};

// Static methods for aggregations
reviewSchema.statics.getMovieStats = async function(movieTitle) {
  const stats = await this.aggregate([
    { $match: { movie_title: movieTitle } },
    {
      $group: {
        _id: '$movie_title',
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
          $sum: {
            $cond: ['$top_critic', 1, 0]
          }
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

  return stats[0] || null;
};

module.exports = mongoose.model('Review', reviewSchema);