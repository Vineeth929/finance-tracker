import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';

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
        status: 'Active'
      });

      setFormData({ title: '', description: '', targetAmount: '', deadline: '', category: 'General' });
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
    return goal?.targetAmount > 0 ? ((goal?.currentAmount || 0) / goal.targetAmount) * 100 : 0;
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Savings Goals</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setError(null);
          }}
          className="btn btn-primary"
        >
          {showAddForm ? '✕ Close' : '+ New Goal'}
        </button>
      </div>

      {error && (
        <GlassCard className="p-4 border border-rose-500/50 bg-rose-500/10">
          <p className="text-rose-400 text-sm">⚠️ {error}</p>
        </GlassCard>
      )}

      {showAddForm && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="label">Goal Title *</label>
              <input
                type="text"
                placeholder="e.g., Emergency Fund, Vacation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            if (!goal) return null;
            const progress = getProgress(goal);

            return (
              <GlassCard key={goal._id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg truncate">{goal.title || 'Unnamed Goal'}</h3>
                  <Badge variant="info">{goal.status || 'Active'}</Badge>
                </div>

                {goal.description && (
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2 text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span className="font-semibold">
                      ₹{formatCurrency(goal.currentAmount || 0)} / ₹{formatCurrency(goal.targetAmount || 0)}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'var(--glass-hover-bg)' }}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{Math.round(progress)}% Complete</p>
                </div>

                {goal.deadline && (
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    📅 Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="w-full btn btn-danger btn-sm"
                >
                  🗑️ Delete Goal
                </button>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <div className="space-y-3">
            <p className="text-4xl">🎯</p>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No goals yet. Create one to start saving towards your dreams!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary inline-block mt-4"
            >
              Create Your First Goal
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
