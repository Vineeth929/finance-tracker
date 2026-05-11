import { useState, useEffect } from 'react';

const CATEGORIES_CACHE_KEY = 'goalCategories';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch and cache goal categories dynamically from backend
 * Ensures frontend always uses categories from source of truth
 */
export function useGoalCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('📦 Using cached goal categories');
          setCategories(data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      console.log('🔄 Fetching goal categories from API...');
      const response = await fetch('/api/meta/goal-categories');

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch categories');
      }

      // Cache the response
      sessionStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify({
        data: data.categories,
        timestamp: Date.now()
      }));

      console.log(`✅ Loaded ${data.categories.length} goal categories from API`);
      console.log('Available categories:', data.categories.map(c => `${c.icon} ${c.label}`).join(', '));

      setCategories(data.categories);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching goal categories:', err);
      setError(err.message);

      // Fallback: Try to use cached data even if stale
      const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        console.warn('⚠️  Using stale cached categories due to fetch error');
        setCategories(data);
      } else {
        // Last resort: Return empty categories
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate if a category ID exists
   */
  const validateCategory = (categoryId) => {
    return categories.some(c => c.id === categoryId);
  };

  /**
   * Get category by ID
   */
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  /**
   * Get valid category IDs
   */
  const getValidCategoryIds = () => {
    return categories.map(c => c.id);
  };

  /**
   * Refresh categories from API
   */
  const refreshCategories = () => {
    sessionStorage.removeItem(CATEGORIES_CACHE_KEY);
    return fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    validateCategory,
    getCategoryById,
    getValidCategoryIds,
    refreshCategories,
  };
}
