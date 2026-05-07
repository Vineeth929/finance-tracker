require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { generalLimiter, authLimiter, externalAPILimiter } = require('./middleware/rateLimiter');

console.log('🔧 Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('📦 MONGODB_URI configured:', !!process.env.MONGODB_URI);
console.log('🔑 JWT_SECRET configured:', !!process.env.JWT_SECRET);
console.log('🌍 Markets, News, and Insights routes enabled - v1.4 MANUAL DEPLOY');

const app = express();
const PORT = process.env.PORT || 5000;
console.log('🎯 Server will listen on port:', PORT);

app.use(cors({
  origin: ['https://vineeth929.github.io', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(generalLimiter);

let mongoConnected = false;

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: mongoConnected ? 'OK' : 'connecting', message: 'Finance Tracker API is running', mongoConnected });
});

// Load routes with error handling
try {
  app.use('/api/auth', authLimiter, require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Failed to load auth routes:', err.message);
}

try {
  app.use('/api/transactions', require('./routes/transactions'));
  console.log('✅ Transactions routes loaded');
} catch (err) {
  console.error('❌ Failed to load transactions routes:', err.message);
}

try {
  app.use('/api/budgets', require('./routes/budgets'));
  console.log('✅ Budgets routes loaded');
} catch (err) {
  console.error('❌ Failed to load budgets routes:', err.message);
}

try {
  app.use('/api/goals', require('./routes/goals'));
  console.log('✅ Goals routes loaded');
} catch (err) {
  console.error('❌ Failed to load goals routes:', err.message);
}

try {
  app.use('/api/markets', externalAPILimiter, require('./routes/markets'));
  console.log('✅ Markets routes loaded');
} catch (err) {
  console.error('❌ Failed to load markets routes:', err.message);
}

try {
  app.use('/api/news', externalAPILimiter, require('./routes/news'));
  console.log('✅ News routes loaded');
} catch (err) {
  console.error('❌ Failed to load news routes:', err.message);
}

try {
  app.use('/api/insights', require('./routes/insights'));
  console.log('✅ Insights routes loaded');
} catch (err) {
  console.error('❌ Failed to load insights routes:', err.message);
}

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/transactions',
      'POST /api/transactions',
      'DELETE /api/transactions/:id',
      'GET /api/budgets',
      'PUT /api/budgets',
      'GET /api/goals',
      'POST /api/goals',
      'DELETE /api/goals/:id',
      'PUT /api/goals/:id/progress',
      'GET /api/markets/crypto',
      'GET /api/markets/overview',
      'GET /api/news',
      'GET /api/news/category/:category',
      'GET /api/insights/health-score',
      'GET /api/insights/spending-insights'
    ]
  });
});

// Start server immediately
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Ready to accept requests`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

// Connect to MongoDB in the background
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      mongoConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
} else {
  console.warn('⚠️  MONGODB_URI not configured, skipping MongoDB connection');
}
