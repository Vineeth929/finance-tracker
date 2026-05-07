const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['Travel', 'Education', 'Home', 'Vehicle', 'Investment', 'Retirement', 'Emergency Fund', 'Other'],
    default: 'Other'
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '🎯'
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused'],
    default: 'Active'
  },
  completedAt: Date
}, {
  timestamps: true
});

// Calculate progress percentage
goalSchema.methods.getProgress = function() {
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
};

// Check if goal is overdue
goalSchema.methods.isOverdue = function() {
  return this.status === 'Active' && new Date() > this.deadline;
};

// Calculate days remaining
goalSchema.methods.getDaysRemaining = function() {
  const now = new Date();
  if (this.status === 'Completed') return 0;
  return Math.ceil((this.deadline - now) / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('Goal', goalSchema);
