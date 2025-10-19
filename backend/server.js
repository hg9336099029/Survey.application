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
app.set('trust proxy', 1);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Security headers (but allow images to be served)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://survey-application-beta.vercel.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    console.log('CORS request from origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow for now, will check in middleware
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// General rate limiting for all requests
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

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
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
  console.log('Health check called');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint to verify file serving
app.get('/test-upload', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    console.log('Test upload called, files:', files);
    res.json({ 
      message: 'Upload test endpoint',
      uploadsDir: uploadsDir,
      uploads: files,
      uploadUrl: `http://localhost:${port}/uploads/`,
      backendUrl: `http://localhost:${port}`
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.method, req.path);
  console.error('Body:', req.body);
  console.error('==============');
  
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS not allowed' });
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    console.error('Multer error code:', err.code);
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
  console.log(`\n========================================`);
  console.log(`Server is running on port ${port}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Access uploads at: http://localhost:${port}/uploads/`);
  console.log(`Backend URL: http://localhost:${port}`);
  console.log(`CORS allowed origins:`, allowedOrigins);
  console.log(`========================================\n`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
});