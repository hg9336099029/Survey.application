const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Trust proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' // Skip health checks
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: false,
  message: 'Too many login attempts, please try again later.',
  skip: (req) => {
    return req.path !== '/login' && req.path !== '/register';
  }
});

app.use(limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Body parser with size limits - AFTER CORS, BEFORE ROUTES
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// Serve static files from uploads folder BEFORE other middleware
app.use('/uploads', express.static(uploadsDir, {
  maxAge: 0,
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
}));

// Database connection
connectDB();

const port = process.env.PORT || 8000;

// API Routes with auth limiter applied
app.use('/api/v1/auth', authLimiter, authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: port,
    uploads: uploadsDir
  });
});

// Test endpoint to verify file serving
app.get('/test-upload', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    console.log('📁 Test upload called, files:', files);
    res.json({
      message: 'Upload test endpoint',
      uploadsDir: uploadsDir,
      uploads: files,
      uploadUrl: `http://localhost:${port}/uploads/`,
      backendUrl: `http://localhost:${port}`
    });
  } catch (error) {
    console.error('❌ Test upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/logout',
      'GET /api/v1/auth/getuser',
      'PUT /api/v1/auth/update-profile',
      'PUT /api/v1/auth/change-password',
      'POST /api/v1/auth/create-poll',
      'GET /api/v1/auth/getpolls',
      'GET /api/v1/auth/userpoll',
      'DELETE /api/v1/auth/delete-poll/:id',
      'PATCH /api/v1/auth/votepoll/:pollId',
      'GET /api/v1/auth/getvotedpolls',
      'POST /api/v1/auth/bookmarkpoll/:pollId',
      'GET /api/v1/auth/getbookmarkedpolls',
      'GET /health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ === ERROR OCCURRED ===');
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  console.error('Request URL:', req.method, req.path);
  console.error('Request Body:', req.body);
  console.error('=======================\n');

  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS not allowed' });
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    console.error('🖼️ Multer error code:', err.code);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 2MB limit' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded' });
    }
    return res.status(400).json({ message: err.message });
  }

  // Handle validation errors
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({ errors: err.array() });
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const server = app.listen(port, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ SERVER STARTED`);
  console.log(`${'='.repeat(50)}`);
  console.log(`🌐 Server running on: http://localhost:${port}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📸 Access uploads at: http://localhost:${port}/uploads/`);
  console.log(`🔗 API Base URL: http://localhost:${port}/api/v1`);
  console.log(`✅ CORS allowed origins:`, allowedOrigins);
  console.log(`🗄️  Database: ${process.env.MONGO_URL ? 'Configured' : 'NOT SET'}`);
  console.log(`${process.env.JWT_SECRET ? '🔐 JWT Secret: Configured' : '⚠️  JWT Secret: NOT SET'}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚫 Port ${port} is already in use`);
    console.error('Try: Kill the process using the port or change PORT in .env');
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
});