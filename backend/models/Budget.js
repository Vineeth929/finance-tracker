const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'default',
    unique: true
  },
  needs: { type: Number, default: 0 },
  wants: { type: Number, default: 0 },
  savings: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
