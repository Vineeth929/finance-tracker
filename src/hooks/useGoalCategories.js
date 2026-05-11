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
          console.log(`   Categories: ${data.map(c => c.id).join(', ')}`);
          setCategories(data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      console.log('🔄 Fetching goal categories from API...');
      const response = await fetch('/api/meta/goal-categories');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📋 API Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'API returned success: false');
      }

      // Validate response structure
      if (!Array.isArray(data.categories)) {
        throw new Error('Invalid API response: categories is not an array');
      }

      if (data.categories.length === 0) {
        console.warn('⚠️  API returned 0 categories. Database might not be seeded yet.');
        throw new Error('No categories found in database. Please seed categories first.');
      }

      // Cache the response
      sessionStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify({
        data: data.categories,
        timestamp: Date.now()
      }));

      console.log(`✅ Loaded ${data.categories.length} goal categories from API`);
      console.table(data.categories.map(c => ({
        ID: c.id,
        Label: c.label,
        Icon: c.icon,
        Active: c.isActive !== false ? '✓' : '✗'
      })));

      // Filter to only active categories
      const activeCategories = data.categories.filter(c => c.isActive !== false);
      console.log(`📍 Active categories: ${activeCategories.map(c => `${c.icon} ${c.label}`).join(', ')}`);

      if (activeCategories.length === 0) {
        throw new Error('No active categories found. Check isActive field in database.');
      }

      setCategories(activeCategories);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching goal categories:', err.message);
      setError(err.message);

      // Fallback: Try to use cached data even if stale
      const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        console.warn('⚠️  Using stale cached categories due to fetch error');
        const activeCategories = data.filter(c => c.isActive !== false);
        setCategories(activeCategories);
      } else {
        // Last resort: Return empty categories with clear error
        console.error('🔴 No cached categories available. Goal creation will fail.');
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
