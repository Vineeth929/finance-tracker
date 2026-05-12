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
    console.log('🔄 useInitializeApp effect triggered');
    console.log('   authLoading:', authLoading);
    console.log('   user:', user?.id || 'NOT SET');

    // Only fetch data AFTER auth is verified (not loading)
    // and we know whether user is authenticated
    if (!authLoading) {
      console.log('✅ Auth loading complete');

      if (user) {
        console.log('👤 User authenticated:', user.id);
        console.log('📥 Fetching data...');

        // User is authenticated, safe to fetch data
        // Use allSettled to prevent one failure from blocking others
        Promise.allSettled([
          fetchTransactions(),
          fetchBudgets(),
          fetchGoals(),
        ]).then((results) => {
          console.log('✅ All data fetches completed');
          results.forEach((result, idx) => {
            const name = ['transactions', 'budgets', 'goals'][idx];
            if (result.status === 'fulfilled') {
              console.log(`   ✅ ${name}: loaded`);
            } else {
              console.log(`   ❌ ${name}: ${result.reason.message}`);
            }
          });
        }).catch(err => {
          // allSettled shouldn't reject, but just in case
          console.error('❌ Data fetch error:', err);
        });
      } else {
        console.log('🚪 User not authenticated, skipping data fetch');
      }
    } else {
      console.log('⏳ Waiting for auth to load...');
    }
  }, [authLoading, user, fetchGoals, fetchTransactions, fetchBudgets]);

  return { authLoading, user };
}
