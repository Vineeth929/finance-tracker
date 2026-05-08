import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">💰 Finance Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back! Log in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="glass p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-2 border-l-4" style={{ borderColor: 'var(--color-danger)', background: `color-mix(in srgb, var(--color-danger) 10%, transparent)` }}>
              <span>⚠️</span>
              <span style={{ color: 'var(--color-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity"
                  style={{ opacity: 0.6 }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary justify-center mt-6"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                '🔓 Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ background: 'var(--bg-gradient)', color: 'var(--text-secondary)' }}>
                or
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div
          className="mt-6 p-4 rounded-lg border-l-4"
          style={{ borderColor: 'var(--color-info)', background: `color-mix(in srgb, var(--color-info) 10%, transparent)` }}
        >
          <p className="text-sm" style={{ color: 'var(--color-info)' }}>
            <strong>Demo Account:</strong><br />
            Email: demo@example.com<br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  );
}
