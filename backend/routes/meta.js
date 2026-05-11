const express = require('express');
const router = express.Router();
const GoalCategory = require('../models/GoalCategory');

// GET all goal categories (public endpoint)
router.get('/goal-categories', async (req, res) => {
  try {
    const categories = await GoalCategory.find({ isActive: true })
      .select('id label description icon accent mood emotionalTheme order')
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      categories,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch goal categories',
      message: err.message
    });
  }
});

// GET single category
router.get('/goal-categories/:id', async (req, res) => {
  try {
    const category = await GoalCategory.findOne({ id: req.params.id, isActive: true })
      .select('id label description icon accent mood emotionalTheme order')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET diagnostic info (for debugging)
router.get('/debug/categories', async (req, res) => {
  try {
    const allCategories = await GoalCategory.find()
      .select('id label isActive')
      .lean();
    const activeCategories = await GoalCategory.find({ isActive: true })
      .select('id label')
      .lean();

    res.json({
      success: true,
      debug: {
        totalCategories: allCategories.length,
        activeCategories: activeCategories.length,
        all: allCategories.map(c => ({
          id: c.id,
          label: c.label,
          active: c.isActive !== false ? '✓' : '✗'
        })),
        activeCategoryIds: activeCategories.map(c => c.id),
        note: 'This endpoint is for debugging only. Check if categories are seeded and marked as active.'
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'Debug endpoint error',
      message: err.message
    });
  }
});

// Validate category ID (used by other routes)
async function validateCategory(categoryId) {
  const category = await GoalCategory.findOne({ id: categoryId, isActive: true });
  return category;
}

module.exports = router;
module.exports.validateCategory = validateCategory;
