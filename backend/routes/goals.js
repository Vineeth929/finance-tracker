const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const GoalCategory = require('../models/GoalCategory');
const { protect } = require('../middleware/auth');

// Middleware to validate category
async function validateCategoryExists(req, res, next) {
  if (req.body.category) {
    try {
      const category = await GoalCategory.findOne({ id: req.body.category, isActive: true });
      if (!category) {
        return res.status(400).json({
          error: `Invalid category: "${req.body.category}". Category does not exist or is inactive.`
        });
      }
      req.validCategory = category;
    } catch (err) {
      return res.status(500).json({ error: 'Error validating category' });
    }
  }
  next();
}

// GET all user's goals (protected)
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET goals by status (protected)
router.get('/status/:status', protect, async (req, res) => {
  try {
    const { status } = req.params;
    if (!['Active', 'Completed', 'Paused'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const goals = await Goal.find({
      userId: req.user.id,
      status: status
    }).sort({ deadline: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single goal (protected - verify ownership)
router.get('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new goal (protected)
router.post('/', protect, validateCategoryExists, async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const goal = new Goal({
      ...req.body,
      userId: req.user.id
    });
    const saved = await goal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update goal (protected - verify ownership)
router.put('/:id', protect, validateCategoryExists, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT add money to goal (protected - verify ownership)
router.put('/:id/add-progress', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    goal.currentAmount += amount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'Completed';
      goal.completedAt = new Date();
    }

    const updated = await goal.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE goal (protected - verify ownership)
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
