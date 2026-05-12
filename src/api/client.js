/**
 * Unified API Client - Single source of truth for all API communication
 * Replaces dual api() implementations in AppContext and useApi.js
 *
 * Features:
 * - Centralized token management
 * - Consistent error handling
 * - Foundation for interceptors/retry
 * - Type-safe method signatures
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor(baseURL, getToken) {
    this.baseURL = baseURL;
    this.getToken = getToken;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const data = await response.json();
        errorMessage = data.error || data.message || errorMessage;
      } catch (e) {
        // Fall back to statusText if response isn't JSON
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.endpoint = endpoint;
      throw error;
    }

    return response.json();
  }

  // Generic methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  auth = {
    signup: (fullName, email, password, confirmPassword) =>
      this.post('/auth/signup', { fullName, email, password, confirmPassword }),

    login: (email, password) =>
      this.post('/auth/login', { email, password }),

    getUser: async (token) => {
      // CRITICAL FIX: Use async/await to ensure token stays set during request
      const originalGetToken = this.getToken;
      this.getToken = () => token;
      try {
        console.log('🔐 Verifying token...');
        const result = await this.get('/auth/me');
        console.log('✅ Token verified, user:', result?.id);
        return result;
      } finally {
        // Restore AFTER the async request completes
        this.getToken = originalGetToken;
      }
    },

    me: () => this.get('/auth/me'),

    updateProfile: (fullName, avatar, preferences) =>
      this.put('/auth/profile', { fullName, avatar, preferences }),

    updatePassword: (oldPassword, newPassword, confirmPassword) =>
      this.put('/auth/password', { oldPassword, newPassword, confirmPassword }),

    logout: () => this.post('/auth/logout'),
  };

  // Transaction endpoints
  transactions = {
    list: () => this.get('/transactions'),
    create: (data) => this.post('/transactions', data),
    update: (id, data) => this.put(`/transactions/${id}`, data),
    delete: (id) => this.delete(`/transactions/${id}`),
  };

  // Budget endpoints
  budgets = {
    list: () => this.get('/budgets'),
    update: (data) => this.put('/budgets', data),
  };

  // Goal endpoints
  goals = {
    list: () => this.get('/goals'),
    create: (data) => this.post('/goals', data),
    update: (id, data) => this.put(`/goals/${id}`, data),
    delete: (id) => this.delete(`/goals/${id}`),
    addProgress: (id, amount) => this.put(`/goals/${id}/add-progress`, { amount }),
  };

  // Meta endpoints
  meta = {
    goalCategories: () => this.get('/meta/goal-categories'),
    goalCategory: (id) => this.get(`/meta/goal-categories/${id}`),
  };

  // Market endpoints
  markets = {
    crypto: () => this.get('/markets/crypto'),
    overview: () => this.get('/markets/overview'),
  };

  // News endpoints
  news = {
    list: () => this.get('/news'),
    byCategory: (category) => this.get(`/news/category/${category}`),
  };

  // Insights endpoints
  insights = {
    healthScore: () => this.get('/insights/health-score'),
    spending: () => this.get('/insights/spending-insights'),
  };
}

// Export singleton instance
export function createAPIClient() {
  return new APIClient(API_BASE_URL, () => localStorage.getItem('authToken'));
}

// Export class for testing
export default APIClient;
