const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth APIs
  async signup(fullName, email, password, confirmPassword) {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, confirmPassword })
    });
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    return res.json();
  },

  async getUser(token) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : getAuthHeaders();
    const res = await fetch(`${BASE_URL}/auth/me`, { headers });
    if (!res.ok) throw new Error('Failed to get user');
    const data = await res.json();
    return data.user;
  },

  async updateProfile(fullName, avatar, preferences) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ fullName, avatar, preferences })
    });
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    return res.json();
  },

  async updatePassword(oldPassword, newPassword, confirmPassword) {
    const res = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
    });
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    return res.json();
  },

  async logout() {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },

  // Transaction APIs
  async getTransactions() {
    const res = await fetch(`${BASE_URL}/transactions`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async addTransaction(data) {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add transaction');
    return res.json();
  },

  async updateTransaction(id, data) {
    const res = await fetch(`${BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return res.json();
  },

  async getBudgets() {
    const res = await fetch(`${BASE_URL}/budgets`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  async updateBudgets(data) {
    const res = await fetch(`${BASE_URL}/budgets`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update budgets');
    return res.json();
  }
};
