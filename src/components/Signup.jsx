import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup(
      formData.fullName,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isPasswordValid = formData.password.length >= 6;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{ background: 'var(--gradient-ambient)' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.h1
            className="text-5xl font-display gradient-text mb-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            ✨
          </motion.h1>
          <h1 className="text-4xl font-display gradient-text mb-2">Finance Tracker</h1>
          <p className="text-lg text-secondary">
            Begin your journey to financial mastery
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div variants={itemVariants} className="glass p-8 space-y-6">
          {/* Error Message - Animated */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 rounded-lg flex items-start gap-3 border-l-4"
              style={{ borderColor: 'var(--emotion-expenses)', background: 'var(--emotion-expenses-bg)' }}
            >
              <span className="text-xl">⚠️</span>
              <span style={{ color: 'var(--emotion-expenses)' }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Input */}
            <motion.div variants={itemVariants}>
              <label className="label">Full Name</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input pl-10"
                  disabled={loading}
                  style={{ background: 'var(--surface-level-2)' }}
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-10"
                  disabled={loading}
                  style={{ background: 'var(--surface-level-2)' }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="label flex items-center gap-2 justify-between">
                Password
                {isPasswordValid && formData.password && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ color: 'var(--emotion-savings)' }}
                  >
                    <CheckCircle2 size={16} />
                  </motion.span>
                )}
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  disabled={loading}
                  style={{ background: 'var(--surface-level-2)' }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </motion.button>
              </div>
              <p className="mt-2 text-xs text-muted">
                {formData.password.length === 0
                  ? 'At least 6 characters required'
                  : isPasswordValid
                    ? '✓ Password strength: Strong'
                    : '✗ Password strength: Weak'}
              </p>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="label flex items-center gap-2 justify-between">
                Confirm Password
                {passwordsMatch && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ color: 'var(--emotion-savings)' }}
                  >
                    <CheckCircle2 size={16} />
                  </motion.span>
                )}
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  disabled={loading}
                  style={{ background: 'var(--surface-level-2)' }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition"
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.label
              variants={itemVariants}
              className="flex items-start gap-3 cursor-pointer text-sm text-secondary hover:text-primary transition"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-indigo-500 mt-1 flex-shrink-0"
                required
              />
              <span>
                I agree to the Terms and Conditions and Privacy Policy of Finance Tracker
              </span>
            </motion.label>

            {/* Signup Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn btn-primary justify-center mt-8 font-heading text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, linear: true }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Create Your Account
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>
                Already a member?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-secondary mb-3">
              Log in to your existing account
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-heading transition"
              style={{ background: 'var(--emotion-analytics-bg)', border: '1px solid var(--emotion-analytics-border)', color: 'var(--emotion-analytics)' }}
            >
              🔓 Log In Instead
            </Link>
          </motion.div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div variants={itemVariants} className="mt-8 space-y-3">
          {[
            { icon: '💰', text: 'Track wealth with emotional intelligence' },
            { icon: '📈', text: 'Beautiful data visualization & insights' },
            { icon: '🎯', text: 'Achieve financial goals with confidence' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-center gap-3 text-sm text-secondary"
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
