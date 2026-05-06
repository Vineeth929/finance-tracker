const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// GET budgets
router.get('/', async (req, res) => {
  try {
    let budget = await Budget.findOne({ key: 'default' });
    if (!budget) {
      budget = await Budget.create({ key: 'default', needs: 0, wants: 0, savings: 0 });
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

// PUT update budgets
router.put('/', async (req, res) => {
  try {
    const { 'Needs': needs, 'Wants': wants, 'Savings & Investment': savings } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { key: 'default' },
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
