const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  needs: { type: Number, default: 0 },
  wants: { type: Number, default: 0 },
  savings: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
