require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

console.log(`[STARTUP] Process starting...`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[STARTUP] PORT: ${PORT}`);

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
  res.json({ status: 'OK', message: 'Finance Tracker API is running' });
});

console.log(`[STARTUP] Attempting MongoDB connection to: ${process.env.MONGODB_URI ? 'MongoDB configured' : 'NO MONGODB_URI'}`);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Load routes AFTER MongoDB connection
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/transactions', require('./routes/transactions'));
    app.use('/api/budgets', require('./routes/budgets'));

    console.log('[STARTUP] Routes loaded');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Listening on 0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
