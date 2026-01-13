/**
 * Chat controller
 */

const Chat = require('../models/chat.model');

// Get messages for a specific room with pagination
exports.getMessages = async (req, res, next) => {
  try {
    const { room } = req.params;
    const { limit = 50, before } = req.query;

    const query = { room };

    // Pagination: get messages before a specific timestamp
    if (before !== undefined) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Chat.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v')
      .lean();

    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to chronological order
      count: messages.length
    });
  } catch (error) {
    next(error);
  }
};

// Check if username exists globally in any message
exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (username === undefined || username.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A valid username is required'
      });
    }

    const exists = await Chat.exists({ username: username.trim() });

    res.json({
      success: true,
      available: !exists
    });
  } catch (error) {
    next(error);
  }
};
