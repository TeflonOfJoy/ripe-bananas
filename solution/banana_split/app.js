/**
 * Main Routing Server (Banana Split)
 * A thin, fast Express server that routes requests to backend services
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');
const socketClient = require('socket.io-client');

// Route handlers
const reviewRoutes = require('./routes/review.routes');
const chatRoutes = require('./routes/chat.routes');
const movieRoutes = require('./routes/movie.routes');
const actorRoutes = require('./routes/actor.routes');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Compression
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/', limiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
  });
}

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to backend chat server via Socket.IO
const chatSocket = socketClient(process.env.SOCKET_CHAT_SERVER_URL || 'http://localhost:3001', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

chatSocket.on('connect', () => {
  console.log('Connected to backend chat server');
});

chatSocket.on('disconnect', () => {
  console.log('Disconnected from backend chat server');
});

chatSocket.on('connect_error', (error) => {
  console.error('Failed to connect to backend chat server:', error.message);
});

// Socket.IO - Proxy chat events to backend server
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Forward join-room event
  socket.on('join-room', (data) => {
    socket.join(data.room);
    chatSocket.emit('join-room', data);
  });

  // Forward send-message event
  socket.on('send-message', (data) => {
    chatSocket.emit('send-message', data);
  });

  // Forward leave-room event
  socket.on('leave-room', (data) => {
    socket.leave(data.room);
    chatSocket.emit('leave-room', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Forward chat events from backend to clients
chatSocket.on('new-message', (data) => {
  io.to(data.room).emit('new-message', data);
});

chatSocket.on('user-joined', (data) => {
  io.to(data.room).emit('user-joined', data);
});

chatSocket.on('user-left', (data) => {
  io.to(data.room).emit('user-left', data);
});

chatSocket.on('error', (data) => {
  io.emit('error', data);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Banana Split Router',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    backends: {
      mongodb: process.env.MONGODB_SERVER_URL,
      springboot: process.env.SPRINGBOOT_SERVER_URL
    }
  });
});

// API Routes - Dynamic data (MongoDB via Express)
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// API Routes - Static data (PostgreSQL via Spring Boot)
app.use('/api/movies', movieRoutes);
app.use('/api/actors', actorRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || err.response?.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Main Router Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`MongoDB Server: ${process.env.MONGODB_SERVER_URL}`);
  console.log(`Spring Boot Server: ${process.env.SPRINGBOOT_SERVER_URL}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    chatSocket.close();
    process.exit(0);
  });
});

module.exports = { app, server, io };
