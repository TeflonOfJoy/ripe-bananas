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
  },

  edited: {
    type: Boolean,
    default: false
  },

  edited_at: {
    type: Date,
    default: null
  }
}, {
  collection: 'chats',
  timestamps: true
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
    timestamp: this.timestamp,
    edited: this.edited,
    edited_at: this.edited_at
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
    .select('-__v -createdAt -updatedAt')
    .lean();
};

// Static method to get messages by room type
chatSchema.statics.getMessagesByType = async function(
  roomType,
  limit = 50
) {
  return await this.find({ room_type: roomType })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('-__v -createdAt -updatedAt')
    .lean();
};

// Static method to get active rooms
chatSchema.statics.getActiveRooms = async function(
  roomType = null,
  timeWindow = 24 * 60 * 60 * 1000
) {
  const filter = {
    timestamp: { $gte: new Date(Date.now() - timeWindow) }
  };
  
  if (roomType !== null) {
    filter.room_type = roomType;
  }

  return await this.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$room',
        room_type: { $first: '$room_type' },
        message_count: { $sum: 1 },
        last_message: { $max: '$timestamp' },
        unique_users: { $addToSet: '$username' }
      }
    },
    {
      $project: {
        room: '$_id',
        room_type: 1,
        message_count: 1,
        last_message: 1,
        user_count: { $size: '$unique_users' }
      }
    },
    { $sort: { last_message: -1 } }
  ]);
};

// Static method to get user's recent rooms
chatSchema.statics.getUserRooms = async function(
  username,
  limit = 10
) {
  return await this.aggregate([
    { $match: { username } },
    {
      $group: {
        _id: '$room',
        room_type: { $first: '$room_type' },
        last_message_time: { $max: '$timestamp' }
      }
    },
    {
      $project: {
        room: '$_id',
        room_type: 1,
        last_message_time: 1
      }
    },
    { $sort: { last_message_time: -1 } },
    { $limit: limit }
  ]);
};

// Pre-save middleware to update timestamp on edit
chatSchema.pre('save', function(next) {
  if (this.isModified('message') && !this.isNew) {
    this.edited = true;
    this.edited_at = new Date();
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;