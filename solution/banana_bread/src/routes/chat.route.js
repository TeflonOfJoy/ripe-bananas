/**
 * Chat routes for REST API
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/username/:username', chatController.checkUsername);

router.get('/:room', chatController.getMessages);

module.exports = router;
