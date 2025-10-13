/**
 * Express MongoDB Server for Movie Review Site
 */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const database = require('./config/database');
const {
  globalErrorHandler,
  notFound
} = require('./middleware/errorHandler');
const reviewRoutes = require('./routes/review.route');
const chatRoutes = require('./routes/chat.route');
const Chat = require('./models/chat.model');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server);



// Logging for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Banana Bread',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: database.getConnectionStatus(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO chat functionality
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a chat room
  socket.on('join-room', async ({ room, username }) => {
    try {
      socket.join(room);
      console.log(
        `User ${username} (${socket.id}) joined room: ${room}`
      );
      
      const history = await Chat.getRecentMessages(room, 50);
      
      socket.emit('chat-history', history.reverse());
      
      socket.to(room).emit('user-joined', {
        username,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { room, username, message, room_type = 'general' } = data;
      
      if (room === undefined || username === undefined || message === undefined) {
        return socket.emit('error', {
          message: 'Missing required fields'
        });
      }
      
      if (message.trim().length === 0) {
        return socket.emit('error', {
          message: 'Message cannot be empty'
        });
      }
      
      if (message.length > 5000) {
        return socket.emit('error', {
          message: 'Message too long'
        });
      }
      
      const chatMessage = new Chat({
        room,
        room_type,
        username,
        message: message.trim(),
        timestamp: new Date()
      });
      
      await chatMessage.save();
      
      io.to(room).emit('new-message', chatMessage.toPublicJSON());
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('leave-room', ({ room, username }) => {
    socket.leave(room);
    console.log(
      `User ${username} (${socket.id}) left room: ${room}`
    );
    
    socket.to(room).emit('user-left', {
      username,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('typing', ({ room, username }) => {
    socket.to(room).emit('user-typing', { username });
  });

  socket.on('stop-typing', ({ room, username }) => {
    socket.to(room).emit('user-stop-typing', { username });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await database.connect();

    // Start HTTP server
    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(
        `MongoDB Express Server running on port ${PORT}`
      );
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');

  server.close(async () => {
    console.log('HTTP server closed');
    await database.disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');

  server.close(async () => {
    console.log('HTTP server closed');
    await database.disconnect();
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection. Shutting down...');
  console.error(err);

  server.close(async () => {
    await database.disconnect();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception! Shutting down...');
  console.error(err);
  process.exit(1);
});

if (require.main === module) {
  startServer();
}

module.exports = { app, server, io };