import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressAnimation from '../components/ui/ProgressAnimation';
import MilestoneCard from '../components/ui/MilestoneCard';
import CuriosityWidget from '../components/ui/CuriosityWidget';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'General',
  });

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Goal title is required');
      }
      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        throw new Error('Target amount must be greater than 0');
      }

      await addGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        status: 'Active',
      });

      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        category: 'General',
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Failed to add goal:', err);
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
            Turn your dreams into reality
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
        >
          {showAddForm ? '✕ Close' : '+ New Goal'}
        </motion.button>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--state-struggling-primary)', background: 'var(--state-struggling-bg)' }}>
            <p className="text-sm" style={{ color: 'var(--state-struggling-primary)' }}>⚠️ {error}</p>
          </div>
        </motion.div>
      )}

      {showAddForm && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
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
