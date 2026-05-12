require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { generalLimiter, authLimiter, externalAPILimiter } = require('./middleware/rateLimiter');

console.log('🔧 Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('📦 MONGODB_URI configured:', !!process.env.MONGODB_URI);
console.log('🔑 JWT_SECRET configured:', !!process.env.JWT_SECRET);
console.log('💹 FINNHUB_API_KEY configured:', !!process.env.FINNHUB_API_KEY);
console.log('🌍 Markets (Indian Stocks), News, and Insights routes enabled');

const app = express();
const PORT = process.env.PORT || 5000;
console.log('🎯 Server will listen on port:', PORT);

// Production-grade CORS configuration with environment variables
const defaultAllowedOrigins = [
  'https://vineeth929.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : defaultAllowedOrigins;

console.log('🔒 CORS allowed origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('📍 Incoming request origin:', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS blocked origin:', origin);
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

try {
  app.use('/api/meta', require('./routes/meta'));
  console.log('✅ Meta routes loaded');
} catch (err) {
  console.error('❌ Failed to load meta routes:', err.message);
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
