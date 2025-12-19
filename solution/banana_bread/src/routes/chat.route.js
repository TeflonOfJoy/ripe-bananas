/**
 * Chat routes for REST API
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// GET /api/chat/username/:username - Check if username is available
router.get('/username/:username', chatController.checkUsername);

// GET /api/chat/:room - Get message history for a room
router.get('/:room', chatController.getMessages);

module.exports = router;
