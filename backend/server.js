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

// Security middleware
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

app.use(limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://survey-application-beta.vercel.app/'
];

app.use(cors());

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files with cache headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1h',
  etag: false
}));

// Database connection
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const port = process.env.PORT || 8000;

// API Routes with auth limiter
app.use('/api/v1/auth', authLimiter, authRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS not allowed' });
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;