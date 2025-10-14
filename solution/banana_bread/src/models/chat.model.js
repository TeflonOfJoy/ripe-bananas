/**
 * Chat model for room-based chat system
 */

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    trim: true,
    index: true,
    maxlength: 200
  },

  room_type: {
    type: String,
    required: true,
    enum: ['movie', 'actor', 'director', 'genre', 'general'],
    default: 'general',
    index: true
  },

  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },

  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },

  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'chats'
});

// Compound indexes for efficient queries
chatSchema.index({ room: 1, timestamp: -1 });
chatSchema.index({ room_type: 1, timestamp: -1 });
chatSchema.index({ username: 1, timestamp: -1 });

// Method to get public representation
chatSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    room: this.room,
    room_type: this.room_type,
    username: this.username,
    message: this.message,
    timestamp: this.timestamp
  };
};

// Static method to get recent messages for a room
chatSchema.statics.getRecentMessages = async function(
  room,
  limit = 50
) {
  return await this.find({ room })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('-__v')
    .lean();
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;