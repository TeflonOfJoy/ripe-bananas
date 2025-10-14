/**
 * Models index - exports all MongoDB models
 */

const Review = require('./review.model');
const ReviewAggregate = require('./reviewAggregate.model');

module.exports = {
  Review,
  ReviewAggregate
};