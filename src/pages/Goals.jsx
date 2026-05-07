import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addGoalProgress } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'General',
  });

  const handleAddGoal = async (e) => {
    e.preventDefault();
    await addGoal({ ...formData, targetAmount: parseFloat(formData.targetAmount) });
    setFormData({ title: '', description: '', targetAmount: '', deadline: '', category: 'General' });
    setShowAddForm(false);
  };

  const getProgress = (goal) => {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Savings Goals</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          + New Goal
        </button>
      </div>

      {showAddForm && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <input
              type="text"
              placeholder="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows="3"
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="input"
              required
            />
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GlassCard key={goal._id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{goal.title}</h3>
              <Badge variant="info">{goal.status}</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-4">{goal.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-300">Progress</span>
                <span className="font-semibold">₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${Math.min(getProgress(goal), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{Math.round(getProgress(goal))}% Complete</p>
            </div>

            {goal.deadline && (
              <p className="text-xs text-gray-400 mb-4">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => deleteGoal(goal._id)}
                className="btn btn-danger btn-sm flex-1"
              >
                Delete
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {goals.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-gray-400 text-lg">No goals yet. Create one to start saving towards your dreams! 🎯</p>
        </GlassCard>
      )}
    </div>
  );
}
