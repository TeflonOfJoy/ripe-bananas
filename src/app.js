/**
 * Express MongoDB Server for Movie Review Site
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const database = require('./config/database');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const reviewRoutes = require('./routes/review.route');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Request logging for dev
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'movie-express-mongo',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: database.getConnectionStatus(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/reviews', reviewRoutes);

// Socket.IO chat functionality (TBD)

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await database.connect();

    // Start HTTP server
    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(`MongoDB Express Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
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