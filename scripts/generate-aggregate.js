/**
 * Aggregation Script
 * Populates the ReviewAggregate collection with precomputed movie statistics
 */

const { Review, ReviewAggregate } = require('../src/models');
const database = require('../src/config/database');

class ReviewAggregator {
  constructor() {
    this.processedMovies = 0;
    this.totalMovies = 0;
  }

  async generateAggregates() {
    console.log('Starting Review Aggregation Process...');
    console.time('Total Aggregation Time');

    try {
      await database.connect();
      console.log('Connected to MongoDB');

      await ReviewAggregate.deleteMany({});
      console.log('Cleared existing aggregates');

      const uniqueMovies = await Review.distinct('movie_title');
      this.totalMovies = uniqueMovies.length;
      
      console.log(`Found ${this.totalMovies} unique movies to process`);

      for (const title of uniqueMovies) {
        await this.processMovie(title);
        this.processedMovies++;
        
        if (this.processedMovies % 10 === 0) {
          console.log(`Progress: ${this.processedMovies}/${this.totalMovies} movies processed`);
        }
      }

      console.timeEnd('Total Aggregation Time');
      console.log(`Aggregation completed! Processed ${this.processedMovies} movies`);
      
    } catch (error) {
      console.error('Aggregation failed:', error);
      throw error;
    }
  }

  async processMovie(title) {
    try {
      const stats = await Review.aggregate([
        { $match: { movie_title: title } },
        {
          $group: {
            _id: '$movie_title',
            
            total_reviews: { $sum: 1 },
            positive_reviews: {
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
            top_critic_positive: {
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
            
            fresh_count: {
              $sum: { $cond: [{ $eq: ['$review_type', 'Fresh'] }, 1, 0] }
            },
            rotten_count: {
              $sum: { $cond: [{ $eq: ['$review_type', 'Rotten'] }, 1, 0] }
            },
            certified_fresh_count: {
              $sum: { $cond: [{ $eq: ['$review_type', 'Certified Fresh'] }, 1, 0] }
            },
            
            latest_review: { $max: '$review_date' },
            earliest_review: { $min: '$review_date' },
            
            avg_score: { 
              $avg: { 
                $cond: [
                  { $ne: ['$review_score', ''] },
                  { $toDouble: '$review_score' },
                  null
                ]
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        console.warn(`No stats found for movie: ${title}`);
        return;
      }

      const movieStats = stats[0];

      const aggregateData = {
        movie_key: title,
        total_reviews: movieStats.total_reviews,
        positive_reviews: movieStats.positive_reviews,
        top_critic_total: movieStats.top_critic_total,
        top_critic_positive: movieStats.top_critic_positive,
        
        fresh_count: movieStats.fresh_count,
        rotten_count: movieStats.rotten_count,
        certified_fresh_count: movieStats.certified_fresh_count,
        
        latest_review: movieStats.latest_review,
        earliest_review: movieStats.earliest_review,
        
        average_score: movieStats.avg_score || 0
      };

      await ReviewAggregate.findOneAndUpdate(
        { movie_key: title },
        aggregateData,
        { upsert: true, new: true }
      );

    } catch (error) {
      console.error(`Error processing movie "${title}":`, error.message);
    }
  }

  async updateMovieAggregate(title) {
    console.log(`Updating aggregate for: ${title}`);
    await this.processMovie(title);
    console.log(`Updated aggregate for: ${title}`);
  }

  async refreshAggregates() {
    console.log('Refreshing all aggregates...');
    await this.generateAggregates();
  }
}

async function runAggregation() {
  const aggregator = new ReviewAggregator();
  
  try {
    await aggregator.generateAggregates();
    console.log('Aggregation script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Aggregation script failed:', error);
    process.exit(1);
  }
}

module.exports = ReviewAggregator;

if (require.main === module) {
  const command = process.argv[2];
  const title = process.argv[3];
  
  runAggregation();
}