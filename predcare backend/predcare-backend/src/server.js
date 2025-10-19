// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import database functions
const { testConnection, initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initializeDatabase();
    
    console.log(' Database ready');
  } catch (error) {
    console.error(' Database initialization failed:', error);
    console.log(' Server will start but database operations may fail');
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PRED Care API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/availability', availabilityRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PRED Care API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      doctors: '/api/doctors',
      availability: '/api/availability'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════╗
║   PRED Care API Server                ║
║   Status: Running ✓                   ║
║   Port: ${PORT}                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}          ║
║   Time: ${new Date().toLocaleString()}   ║
╚═══════════════════════════════════════╝
  `);
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Mobile access: http://192.168.1.100:5000:${PORT}`);

  
  // Initialize database after server starts
  startServer();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;