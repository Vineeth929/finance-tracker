const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

// GET user's budget (protected)
router.get('/', protect, async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      budget = await Budget.create({
        userId: req.user.id,
        needs: 0,
        wants: 0,
        savings: 0
      });
    }
    res.json({
      'Needs': budget.needs,
      'Wants': budget.wants,
      'Savings & Investment': budget.savings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user's budget (protected)
router.put('/', protect, async (req, res) => {
  try {
    const { 'Needs': needs, 'Wants': wants, 'Savings & Investment': savings } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { needs: needs || 0, wants: wants || 0, savings: savings || 0 },
      { new: true, upsert: true }
    );
    res.json({
      'Needs': budget.needs,
      'Wants': budget.wants,
      'Savings & Investment': budget.savings
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
