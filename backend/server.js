require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

console.log(`[STARTUP] Process starting...`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[STARTUP] PORT: ${PORT}`);

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
});

// Test route that doesn't depend on anything
app.get('/test', (req, res) => {
  console.log('[REQUEST] /test received');
  res.json({ message: 'Test OK' });
});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://vineeth929.github.io',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('[REQUEST] /api/health received');
  res.json({ status: 'OK', message: 'Finance Tracker API is running' });
});

console.log(`[STARTUP] Attempting MongoDB connection to: ${process.env.MONGODB_URI ? 'MongoDB configured' : 'NO MONGODB_URI'}`);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    try {
      // Load routes AFTER MongoDB connection
      console.log('[STARTUP] Loading auth routes...');
      app.use('/api/auth', require('./routes/auth'));
      console.log('[STARTUP] Loading transaction routes...');
      app.use('/api/transactions', require('./routes/transactions'));
      console.log('[STARTUP] Loading budget routes...');
      app.use('/api/budgets', require('./routes/budgets'));
      console.log('[STARTUP] Routes loaded');
    } catch (routeErr) {
      console.error('[STARTUP] Error loading routes:', routeErr.message);
      console.error(routeErr.stack);
      process.exit(1);
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Listening on 0.0.0.0:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('[SERVER ERROR]', err.message);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
