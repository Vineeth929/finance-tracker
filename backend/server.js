require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

console.log('🔧 Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('📦 MONGODB_URI configured:', !!process.env.MONGODB_URI);
console.log('🔑 JWT_SECRET configured:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;
console.log('🎯 Server will listen on port:', PORT);

app.use(cors({
  origin: ['https://vineeth929.github.io', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

let mongoConnected = false;

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: mongoConnected ? 'OK' : 'connecting', message: 'Finance Tracker API is running', mongoConnected });
});

// Load routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));

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
