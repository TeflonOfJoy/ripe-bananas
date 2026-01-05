= MongoDB <sec:mongodb>

== Solution

=== Design and Motivations

The MongoDB implementation follows a design that leverages NoSQL strengths. The data is organized into three collections:

1. *Reviews Collection* (`reviews`): Stores individual movie reviews with denormalized data. Each document contains the complete review information including `movie_id`, `movie_title`, `critic_name`, `review_type` (Fresh/Rotten/Certified Fresh), and `review_score`.

2. *Review Aggregates Collection* (`review_aggregates`): Implements the precomputation of useful metrics for statistics. Instead of calculating scores on every request, aggregated metrics e.g. (bananameter, top_critic_score, ...) are precomputed and cached.

3. *Chats Collection* (`chats`): Topic based chat messages.


=== Implementation

The implementation uses *Mongoose* as the ODM layer with the following key features:

*Connection Management*: A singleton `Database` class handles connection lifecycle with pooling, timeouts, and shutdown handlers.

*Indexing Strategy*: Compound indexes are defined for common query patterns:
- `{ room: 1, timestamp: -1 }` for chat message retrieval
- `{ movie_id: 1, review_date: -1 }` for chronological reviews
- `{ movie_id: 1, top_critic: 1 }` for filtered aggregations

*Static Methods*: The models expose some specific operations:
- `Review.getMovieStats(movieId)` - aggregation pipeline for statistics
- `ReviewAggregate.getTopRated(limit, minReviews)` - sorted query with minimum threshold
- `Chat.getRecentMessages(room, limit)` - paginated message retrieval

== Issues

The main challenge was optimizing read performance without compromising the data "freshness". The calculation of review scores on every request was abandoned from the start and the focus was put on precomputed aggregates to solve the performance grievance.
The final decision was to run an aggregation script every night so that at most the aggregated data is 24h "stale" 

== Requirements

The implementation satisfies the requirements:
- All dynamic data is stored in MongoDB
- MongoDB is correctly implemented using Mongoose
- File system organization follows MVC pattern (`models/`, `controllers/`, `routes/`)
- NoSQL design principles are applied (denormalization, precomputation)
- Indexes optimize the most frequent query patterns

== Limitations

- *Eventual Consistency*: Precomputed aggregates may be stale until the next aggregation job runs
- *Denormalization Overhead*: Changes require updates across multiple documents
- *Scalability*: Single database instance
