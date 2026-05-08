import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
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
            💰
          </motion.h1>
          <h1 className="text-4xl font-display gradient-text mb-2">Finance Tracker</h1>
          <p className="text-lg text-secondary">
            Welcome back to your financial journey
          </p>
        </motion.div>

        {/* Login Card */}
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

          <form onSubmit={handleLogin} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  disabled={loading}
                  style={{ background: 'var(--bg-surface-2)' }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="label">Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  disabled={loading}
                  style={{ background: 'var(--bg-surface-2)' }}
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
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary transition">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition"
                style={{ color: 'var(--emotion-analytics)' }}
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn btn-primary justify-center mt-8 font-heading text-base"
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
                  <Lock size={18} />
                  Log In to Dashboard
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
                New to Finance Tracker?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-secondary mb-3">
              Create an account to start tracking your wealth
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-heading transition"
              style={{ background: 'var(--emotion-goals-bg)', border: '1px solid var(--emotion-goals-border)', color: 'var(--emotion-goals)' }}
            >
              ✨ Create Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Demo Info - Animated */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-5 rounded-xl border-l-4"
          style={{
            borderColor: 'var(--emotion-analytics)',
            background: 'var(--emotion-analytics-bg)',
          }}
        >
          <p className="font-heading mb-2" style={{ color: 'var(--emotion-analytics)' }}>💡 Quick Demo</p>
          <p className="text-sm text-secondary">
            <span className="block">Email: <code className="bg-black/30 px-2 py-1 rounded">demo@example.com</code></span>
            <span className="block mt-1">Password: <code className="bg-black/30 px-2 py-1 rounded">demo123</code></span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
