import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useGoalCategories } from '../hooks/useGoalCategories';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressAnimation from '../components/ui/ProgressAnimation';
import MilestoneCard from '../components/ui/MilestoneCard';
import CuriosityWidget from '../components/ui/CuriosityWidget';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function GoalsPage() {
  const { goals = [], addGoal, deleteGoal } = useApp();
  const { categories, loading: categoriesLoading, error: categoriesError, validateCategory, getValidCategoryIds } = useGoalCategories();

  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: '', // Will be set once categories load
  });

  // Update formData category when categories load
  React.useEffect(() => {
    if (categories.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: prev.category || categories[0].id // Use first category if not set
      }));
      console.log('✅ Form initialized with first category:', categories[0].id);
    }
  }, [categories]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation 1: Check if categories are loaded
      if (categories.length === 0) {
        throw new Error('Categories are not available yet. Please wait for them to load, or refresh the page.');
      }

      // Validation 2: Check category is selected
      if (!formData.category || formData.category.trim() === '') {
        throw new Error('Please select a goal category');
      }

      // Validation 3: Check title
      if (!formData.title.trim()) {
        throw new Error('Goal title is required');
      }

      // Validation 4: Check amount
      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        throw new Error('Target amount must be greater than 0');
      }

      // Validation 5: Check category is valid and active
      const selectedCategory = categories.find(c => c.id === formData.category);
      if (!selectedCategory) {
        const validIds = categories.map(c => c.id);
        throw new Error(`Invalid category: "${formData.category}". Valid categories: ${validIds.join(', ')}`);
      }

      if (selectedCategory.isActive === false) {
        throw new Error(`Category "${selectedCategory.label}" is inactive. Please select another.`);
      }

      // Log for debugging
      console.log('✅ Form validation passed');
      console.log('📝 Creating goal with:');
      console.log('   Title:', formData.title);
      console.log('   Category ID:', formData.category);
      console.log('   Category Label:', selectedCategory.label);
      console.log('   Amount:', formData.targetAmount);

      await addGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        status: 'Active',
      });

      // Reset form to first category
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        category: categories.length > 0 ? categories[0].id : '',
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('❌ Failed to add goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await deleteGoal(goalId);
    } catch (err) {
      setError(`Failed to delete goal: ${err.message}`);
      console.error('Failed to delete goal:', err);
    }
  };

  const getProgress = (goal) => {
    return goal?.targetAmount > 0
      ? ((goal?.currentAmount || 0) / goal.targetAmount) * 100
      : 0;
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  const completedGoals = goals.filter(g => g?.status === 'Completed');
  const activeGoals = goals.filter(g => g?.status === 'Active');
  const totalTargetAmount = goals.reduce((sum, g) => sum + (g?.targetAmount || 0), 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + (g?.currentAmount || 0), 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  // Show loading skeleton while categories are fetching
  if (categoriesLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-20 sm:h-24" count={1} />
        <SkeletonLoader height="h-96" count={1} />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 animate-fadeIn"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header - Responsive */}
      <motion.div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
            Savings Goals 🎯
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Turn your dreams into reality {categoriesLoading && '(Loading categories...)'}
          </p>
        </div>
        <motion.button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setError(null);
          }}
          className="btn btn-primary btn-sm sm:btn-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={categoriesLoading || categories.length === 0}
        >
          {showAddForm ? '✕ Close' : '+ New Goal'}
        </motion.button>
      </motion.div>

      {/* Error Messages */}
      {error && (
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--emotion-expenses)', background: 'var(--emotion-expenses-bg)' }}>
            <p className="text-sm" style={{ color: 'var(--emotion-expenses)' }}>⚠️ {error}</p>
          </div>
        </motion.div>
      )}

      {/* Category Loading Error */}
      {categoriesError && (
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--emotion-expenses)', background: 'var(--emotion-expenses-bg)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: 'var(--emotion-expenses)' }}>
              🔴 Could not load goal categories
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--emotion-expenses)' }}>
              {categoriesError}
            </p>
            <p className="text-xs" style={{ color: 'var(--emotion-expenses)' }}>
              <strong>Troubleshooting:</strong><br/>
              1. Make sure the backend seed script has been run: <code>node backend/seeds/seedGoalCategories.js</code><br/>
              2. Check that the database has GoalCategory documents<br/>
              3. Try refreshing the page<br/>
              4. Clear browser cache: <code>sessionStorage.removeItem('goalCategories')</code>
            </p>
          </div>
        </motion.div>
      )}

      {/* Create Goal Form */}
      {showAddForm && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
            {categoriesLoading ? (
              <div className="text-center py-8">
                <p className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>
                  ⏳ Loading categories from server...
                </p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 p-4 rounded-lg" style={{ background: 'var(--emotion-expenses-bg)' }}>
                <p className="font-bold mb-3" style={{ color: 'var(--emotion-expenses)' }}>
                  ❌ No categories available
                </p>
                <p className="text-sm mb-3" style={{ color: 'var(--emotion-expenses)' }}>
                  The database has no active goal categories. This typically means:
                </p>
                <ul className="text-sm text-left max-w-md mx-auto space-y-2 mb-4" style={{ color: 'var(--emotion-expenses)' }}>
                  <li>• The seed script hasn't been run yet</li>
                  <li>• All categories are marked as inactive (isActive: false)</li>
                  <li>• Database connection issue</li>
                </ul>
                <p className="text-xs font-mono" style={{ color: 'var(--emotion-expenses)' }}>
                  Run: <code className="bg-black/20 px-2 py-1 rounded">node backend/seeds/seedGoalCategories.js</code>
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="label">Goal Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    placeholder="What is this goal for?"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input"
                    disabled={loading}
                    style={{ background: 'var(--surface-level-2)', color: 'var(--text-primary)' }}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Target Amount *</label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAmount: e.target.value })
                      }
                      className="input"
                      min="0"
                      step="100"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="label">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Creating...' : 'Create Goal'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setError(null);
                    }}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Overall Progress Summary */}
      {goals.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Overall Progress</h3>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ₹{formatCurrency(totalCurrentAmount)} toward ₹{formatCurrency(totalTargetAmount)}
                </p>
              </div>
              <ProgressAnimation
                value={overallProgress}
                max={100}
                variant="growth"
                showGlow={true}
              />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Celebration for Completed Goals */}
      {completedGoals.length > 0 && (
        <motion.div variants={itemVariants}>
          <MilestoneCard
            title={`${completedGoals.length} Goal${completedGoals.length > 1 ? 's' : ''} Completed!`}
            description="You've achieved these milestones"
            achievement={`🎉 Congratulations on reaching ${completedGoals.length} goal${completedGoals.length > 1 ? 's' : ''}!`}
            icon="🏆"
            progress={100}
            details={[
              {
                label: 'Total Amount',
                value: `₹${formatCurrency(completedGoals.reduce((sum, g) => sum + (g?.targetAmount || 0), 0))}`,
              },
            ]}
          />
        </motion.div>
      )}

      {/* Insights for Goal Success */}
      {activeGoals.length > 0 && (
        <motion.div className="space-y-3" variants={itemVariants}>
          {activeGoals.slice(0, 2).map((goal, idx) => {
            if (!goal) return null;
            const progress = getProgress(goal);
            const daysLeft = goal.deadline
              ? Math.ceil(
                  (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                )
              : null;

            return (
              <CuriosityWidget
                key={goal._id}
                title={`${goal.title} - ${Math.round(progress)}% Complete`}
                message={`${daysLeft && daysLeft > 0 ? `${daysLeft} days left` : 'No deadline set'} • ₹${formatCurrency(goal.currentAmount || 0)} of ₹${formatCurrency(goal.targetAmount || 0)}`}
                detail={`You're making great progress toward ${goal.title}. Keep up the momentum!${goal.description ? ` ${goal.description}` : ''}`}
                type={
                  progress >= 75
                    ? 'achievement'
                    : progress >= 50
                      ? 'discovery'
                      : 'insight'
                }
                initialExpanded={false}
              />
            );
          })}
        </motion.div>
      )}

      {/* Active Goals Grid */}
      {activeGoals.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {activeGoals.map((goal, idx) => {
            if (!goal) return null;
            const progress = getProgress(goal);

            return (
              <motion.div key={goal._id} variants={itemVariants}>
                <GlassCard className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg truncate flex-1">
                      {goal.title || 'Unnamed Goal'}
                    </h3>
                    <Badge variant="info">{goal.status || 'Active'}</Badge>
                  </div>

                  {goal.description && (
                    <p
                      className="text-sm mb-4 line-clamp-2 flex-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {goal.description}
                    </p>
                  )}

                  {/* Animated Progress Visualization */}
                  <div className="mt-auto space-y-4">
                    <ProgressAnimation
                      label="Progress"
                      value={progress}
                      max={100}
                      variant={
                        progress >= 75
                          ? 'success'
                          : progress >= 50
                            ? 'growth'
                            : 'default'
                      }
                      showGlow={true}
                    />

                    {/* Amount Info */}
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Saved
                        </span>
                        <span className="font-semibold">
                          ₹{formatCurrency(goal.currentAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Target
                        </span>
                        <span className="font-semibold">
                          ₹{formatCurrency(goal.targetAmount || 0)}
                        </span>
                      </div>
                      {goal.deadline && (
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Deadline
                          </span>
                          <span className="font-semibold">
                            {new Date(goal.deadline).toLocaleDateString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="w-full btn btn-secondary btn-sm text-xs mt-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete Goal
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        !showAddForm && (
          <motion.div variants={itemVariants}>
            <GlassCard className="p-8 text-center">
              <p
                className="text-sm sm:text-base mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                No goals yet. Create one to start your financial journey! 🚀
              </p>
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                disabled={categoriesLoading || categories.length === 0}
              >
                + Create Your First Goal
              </motion.button>
            </GlassCard>
          </motion.div>
        )
      )}

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <motion.div className="mt-8" variants={itemVariants}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Completed Goals ✨
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {completedGoals.map((goal, idx) => (
              <motion.div key={goal._id} variants={itemVariants}>
                <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{goal.title}</h4>
                      <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        ₹{formatCurrency(goal.targetAmount || 0)} • Completed
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
