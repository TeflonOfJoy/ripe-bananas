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
      .select('-__v -createdAt -updatedAt')
      .lean();

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to chronological order
      count: messages.length
    });
  } catch (error) {
    next(error);
  }
};

// Get active chat rooms
exports.getActiveRooms = async (req, res, next) => {
  try {
    const { room_type, hours = 24 } = req.query;
    const timeWindow = parseInt(hours) * 60 * 60 * 1000;

    const rooms = await Chat.getActiveRooms(room_type || null, timeWindow);

    res.json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    next(error);
  }
};
