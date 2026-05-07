const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: String,
    required: true
  },
  category: String,
  subcategory: String,
  source: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
