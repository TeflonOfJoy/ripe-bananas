/**
 * ReviewAggregate model for precomputed movie review statistics
 */

const mongoose = require('mongoose');

const reviewAggregateSchema = new mongoose.Schema({
  // Movie identifier
  movie_key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },

  // Overall review counts
  total_reviews: {
    type: Number,
    default: 0,
    min: 0
  },

  positive_reviews: {
    type: Number,
    default: 0,
    min: 0
  },

  // Top critic specific counts
  top_critic_total: {
    type: Number,
    default: 0,
    min: 0
  },

  top_critic_positive: {
    type: Number,
    default: 0,
    min: 0
  },

  // Audience reviews
  audience_total: {
    type: Number,
    default: 0,
    min: 0
  },

  audience_positive: {
    type: Number,
    default: 0,
    min: 0
  },

  // Computed percentages
  bananameter: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  top_critic_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  audience_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Status indicators
  certified_fresh: {
    type: Boolean,
    default: false
  },

  // Last update timestamp for cache invalidation
  last_updated: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'review_aggregates',
  timestamps: false
});

// Index for bulk operations and sorting
reviewAggregateSchema.index({ last_updated: -1 });
reviewAggregateSchema.index({ bananameter: -1 });

// Instance methods
reviewAggregateSchema.methods.toPublicJSON = function() {
  return {
    movie_key: this.movie_key,
    bananameter: this.bananameter,
    top_critic_score: this.top_critic_score,
    audience_score: this.audience_score,
    certified_fresh: this.certified_fresh,
    total_reviews: this.total_reviews,
    top_critic_total: this.top_critic_total,
    last_updated: this.last_updated
  };
};

// Static methods for aggregate operations
reviewAggregateSchema.statics.updateMovieStats = async function(
  movieKey,
  reviewData
) {
  const existing = await this.findOne({ movie_key: movieKey });

  if (existing !== null) {
    // Update existing aggregate
    existing.total_reviews = reviewData.total_reviews || 0;
    existing.positive_reviews = reviewData.positive_reviews || 0;
    existing.top_critic_total = reviewData.top_critic_total || 0;
    existing.top_critic_positive = reviewData.top_critic_positive || 0;
    existing.audience_total = reviewData.audience_total || 0;
    existing.audience_positive = reviewData.audience_positive || 0;

    return await existing.save();
  } else {
    // Create new aggregate
    return await this.create({
      movie_key: movieKey,
      ...reviewData
    });
  }
};

reviewAggregateSchema.statics.getTopRated = async function(
  limit = 20,
  minReviews = 10
) {
  return await this.find({
    total_reviews: { $gte: minReviews }
  })
  .sort({ bananameter: -1, total_reviews: -1 })
  .limit(limit)
  .lean();
};

reviewAggregateSchema.statics.getCertifiedFresh = async function(limit = 20) {
  return await this.find({
    certified_fresh: true
  })
  .sort({ bananameter: -1, total_reviews: -1 })
  .limit(limit)
  .lean();
};

module.exports = mongoose.model('ReviewAggregate', reviewAggregateSchema);