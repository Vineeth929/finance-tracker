const mongoose = require('mongoose');

const goalCategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '📌',
  },
  accent: {
    type: String,
    enum: ['emerald', 'cyan', 'amber', 'violet', 'rose'],
    default: 'violet',
  },
  mood: {
    type: String,
    enum: ['calm-growth', 'focused-clarity', 'warm-aspiration', 'creative-energy', 'alert-care'],
    default: 'calm-growth',
  },
  emotionalTheme: {
    type: String,
    enum: ['savings', 'investments', 'goals', 'analytics', 'expenses'],
    default: 'goals',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure we can query by isActive efficiently (id index created by unique: true)
goalCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('GoalCategory', goalCategorySchema);
