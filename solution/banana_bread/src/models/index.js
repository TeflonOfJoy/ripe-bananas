/**
 * Models index - exports all MongoDB models
 */

const Review = require('./review.model');
const ReviewAggregate = require('./reviewAggregate.model');
const Chat = require('./chat.model');

module.exports = {
  Review,
  ReviewAggregate,
  Chat
};