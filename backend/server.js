const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

console.log(`Starting minimal server on port ${PORT}`);

app.get('/test', (req, res) => {
  res.json({ message: 'Minimal server works' });
});

// Connect and start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
