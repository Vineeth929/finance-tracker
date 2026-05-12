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

  console.log('🔍 [RENDER] useInitializeApp rendered, authLoading:', authLoading, 'user:', user?.id);

  useEffect(() => {
    console.log('🔄 [EFFECT] useInitializeApp effect triggered');
    console.log('   authLoading:', authLoading);
    console.log('   user exists:', !!user);
    console.log('   user.id:', user?.id || 'UNDEFINED');

    // Only fetch data AFTER auth is verified (not loading)
    // and we know whether user is authenticated
    if (!authLoading) {
      console.log('✅ [CONDITION] authLoading is false, checking user...');

      if (user) {
        console.log('✅ [CONDITION] user exists, starting data fetch');
        console.log('   user.id:', user.id);
        console.log('📥 Calling: fetchTransactions, fetchBudgets, fetchGoals');

        // User is authenticated, safe to fetch data
        // Use allSettled to prevent one failure from blocking others
        Promise.allSettled([
          fetchTransactions().then(() => 'transactions'),
          fetchBudgets().then(() => 'budgets'),
          fetchGoals().then(() => 'goals'),
        ]).then((results) => {
          console.log('✅ [COMPLETE] All data fetches settled');
          results.forEach((result, idx) => {
            const names = ['transactions', 'budgets', 'goals'];
            if (result.status === 'fulfilled') {
              console.log(`   ✅ ${names[idx]}: success`);
            } else {
              console.log(`   ❌ ${names[idx]}: ${result.reason.message}`);
            }
          });
        }).catch(err => {
          console.error('❌ [ERROR] Unexpected error in allSettled:', err);
        });
      } else {
        console.log('⚠️  [CONDITION] user is NOT set, skipping data fetch');
        console.log('   This means user was logged out or auth failed');
      }
    } else {
      console.log('⏳ [WAIT] authLoading is still true, cannot fetch yet');
    }
  }, [authLoading, user, fetchGoals, fetchTransactions, fetchBudgets]);

  return { authLoading, user };
}
