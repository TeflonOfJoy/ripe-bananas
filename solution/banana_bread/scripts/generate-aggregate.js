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
          console.log(
            `Progress: ${this.processedMovies}/${this.totalMovies} ` +
            `movies processed`
          );
        }
      }

      console.timeEnd('Total Aggregation Time');
      console.log(
        `Aggregation completed! Processed ${this.processedMovies} movies`
      );
      
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
          total_reviews:       { $sum: 1 },
          positive_reviews:    {
            $sum: {
              $cond: [
                { $in: ['$review_type', ['Fresh','Certified Fresh']] },
                1,
                0
              ]
            }
          },
          top_critic_total:    { $sum: { $cond: ['$top_critic', 1, 0] } },
          top_critic_positive: {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$top_critic',
                    { $in: ['$review_type', ['Fresh','Certified Fresh']] }
                  ]
                },
                1,
                0
              ]
            }
          },
          audience_total:      { $sum: { $cond: ['$audience_review', 1, 0] } },
          audience_positive:   {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$audience_review',
                    { $in: ['$review_type', ['Fresh','Certified Fresh']] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          movie_key:'$_id',
          total_reviews:   1,
          positive_reviews:1,
          top_critic_total:1,
          top_critic_positive:1,
          audience_total:  1,
          audience_positive:1,
          bananameter: {
            $cond: [
              { $gt: ['$total_reviews', 0] },
              { $round: [
                  { $multiply: [
                      { $divide: ['$positive_reviews', '$total_reviews'] },
                      100
                  ] },
                  0
              ] },
              0
            ]
          },
          top_critic_score: {
            $cond: [
              { $gt: ['$top_critic_total', 0] },
              { $round: [
                  { $multiply: [
                      {
                        $divide: [
                          '$top_critic_positive',
                          '$top_critic_total'
                        ]
                      },
                      100
                  ] },
                  0
              ] },
              0
            ]
          },
          audience_score: {
            $cond: [
              { $gt: ['$audience_total', 0] },
              { $round: [
                  { $multiply: [
                      { $divide: ['$audience_positive', '$audience_total'] },
                      100
                  ] },
                  0
              ] },
              0
            ]
          },
          last_updated: { $literal: new Date() }
        }
      },
      {
        $addFields: {
          certified_fresh: {
            $and: [
              { $gte: ['$bananameter', 70] },
              { $gte: ['$total_reviews', 50] },
              { $gte: ['$top_critic_total', 5] }
            ]
          }
        }
      }
    ]);

    if (stats.length === 0) {
      console.warn(`No stats for movie: ${title}`);
      return;
    }

    await ReviewAggregate.findOneAndUpdate(
      { movie_key: title },
      stats[0],
      { upsert: true, new: true }
    );

  } catch (error) {
    console.error(`Error processing "${title}":`, error);
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