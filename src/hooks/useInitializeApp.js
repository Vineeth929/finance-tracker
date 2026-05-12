/**
 * App Initialization Hook
 * Fixes auth/data hydration race condition
 *
 * Problem: AuthProvider and AppProvider both use useEffect
 * They run independently and race to verify token vs fetch data
 *
 * Solution: This hook waits for auth verification before fetching data
 *
 * Usage in App.jsx:
 * function AppContent() {
 *   const { authLoading } = useInitializeApp();
 *   if (authLoading) return <LoadingScreen />;
 *   return <Routes>...</Routes>;
 * }
 */

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function useInitializeApp() {
  const { user, loading: authLoading } = useAuth();
  const { fetchGoals, fetchTransactions, fetchBudgets } = useApp();

  useEffect(() => {
    // Only fetch data AFTER auth is verified (not loading)
    // and we know whether user is authenticated
    if (!authLoading) {
      if (user) {
        // User is authenticated, safe to fetch data
        // Use allSettled to prevent one failure from blocking others
        Promise.allSettled([
          fetchTransactions(),
          fetchBudgets(),
          fetchGoals(),
        ]).catch(err => {
          // allSettled shouldn't reject, but just in case
          console.error('Data fetch error:', err);
        });
      } else {
        // Auth verification completed but no user (not logged in)
        // Don't fetch data, let app show login page
      }
    }
  }, [authLoading, user, fetchGoals, fetchTransactions, fetchBudgets]);

  return { authLoading, user };
}
