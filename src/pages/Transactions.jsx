import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useModals } from '../context/ModalContext';
import GlassCard from '../components/ui/GlassCard';
import AddIncome from '../components/AddIncome';
import AddExpense from '../components/AddExpense';
import TransactionList from '../components/TransactionList';
import NarrativeChart from '../components/ui/NarrativeChart';
import CuriosityWidget from '../components/ui/CuriosityWidget';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useApp();
  const { showToast } = useModals();
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'add-income', 'add-expense', 'delete'
    data: null,
    isLoading: false
  });

  const handleAddTransaction = async (tx) => {
    setConfirmDialog(prev => ({
      ...prev,
      isOpen: true,
      type: tx.type === 'income' ? 'add-income' : 'add-expense',
      data: tx
    }));
  };

  const handleConfirmAdd = async () => {
    setConfirmDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await addTransaction(confirmDialog.data);
      showToast(
        `Transaction added: ₹${confirmDialog.data.amount.toLocaleString('en-IN')} ${confirmDialog.data.type === 'income' ? 'income' : 'expense'}`,
        'success'
      );
      setShowAddIncome(false);
      setShowAddExpense(false);
      setConfirmDialog({ isOpen: false, type: null, data: null, isLoading: false });
    } catch (err) {
      showToast(`Failed to add transaction: ${err.message}`, 'error');
      console.error('Failed to add transaction:', err);
    } finally {
      setConfirmDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteTransaction = (id, tx) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      data: { id, transaction: tx },
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteTransaction(confirmDialog.data.id);
      showToast('Transaction deleted', 'success');
      setConfirmDialog({ isOpen: false, type: null, data: null, isLoading: false });
    } catch (err) {
      showToast(`Failed to delete transaction: ${err.message}`, 'error');
      console.error('Failed to delete transaction:', err);
    } finally {
      setConfirmDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Analyze spending patterns
  const expensesByCategory = {};
  const incomeByType = {};

  transactions?.forEach(tx => {
    if (tx?.type === 'expense') {
      const cat = tx.category || 'Other';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + (tx.amount || 0);
    } else if (tx?.type === 'income') {
      const type = tx.description || 'Income';
      incomeByType[type] = (incomeByType[type] || 0) + (tx.amount || 0);
    }
  });

  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));

  const topIncomeTypes = Object.entries(incomeByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 animate-fadeIn"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
            Transactions 📊
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track every financial move and discover patterns
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            onClick={() => setShowAddIncome(true)}
            className="btn btn-primary btn-sm sm:btn-base flex-1 sm:flex-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            + <span className="hidden sm:inline">Income</span><span className="sm:hidden">In</span>
          </motion.button>
          <motion.button
            onClick={() => setShowAddExpense(true)}
            className="btn btn-secondary btn-sm sm:btn-base flex-1 sm:flex-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            + <span className="hidden sm:inline">Expense</span><span className="sm:hidden">Out</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Add Income Form */}
      {showAddIncome && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <AddIncome onAddIncome={handleAddTransaction} />
          </GlassCard>
        </motion.div>
      )}

      {/* Add Expense Form */}
      {showAddExpense && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <AddExpense onAddExpense={handleAddTransaction} />
          </GlassCard>
        </motion.div>
      )}

      {/* Spending Patterns */}
      {transactions && transactions.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          variants={itemVariants}
        >
          {topIncomeTypes.length > 0 && (
            <GlassCard className="p-4 sm:p-6">
              <NarrativeChart
                type="income"
                title="Income Sources"
                icon="💵"
                data={topIncomeTypes}
              />
            </GlassCard>
          )}

          {topExpenseCategories.length > 0 && (
            <GlassCard className="p-4 sm:p-6">
              <NarrativeChart
                type="spending"
                title="Top Expenses"
                icon="💳"
                data={topExpenseCategories}
              />
            </GlassCard>
          )}
        </motion.div>
      )}

      {/* Smart Insights */}
      {transactions && transactions.length > 0 && (
        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={itemVariants}
        >
          <h2 className="text-lg font-bold">Insights & Patterns</h2>

          {topExpenseCategories[0] && (
            <CuriosityWidget
              title={`Your Top Spending: ${topExpenseCategories[0].label}`}
              message={`₹${topExpenseCategories[0].value.toLocaleString()} spent on ${topExpenseCategories[0].label.toLowerCase()}`}
              detail={`This is your largest expense category. Consider if you can optimize this while maintaining your lifestyle.`}
              type="discovery"
              initialExpanded={false}
            />
          )}

          {topExpenseCategories.length > 1 && topExpenseCategories[0].value > topIncomeTypes[0]?.value && (
            <CuriosityWidget
              title="Spending Awareness"
              message="Your expenses are significant"
              detail={`Your top expense category (${topExpenseCategories[0].label}) is ₹${topExpenseCategories[0].value.toLocaleString()}. Review if this aligns with your financial goals.`}
              type="suggestion"
              initialExpanded={false}
            />
          )}

          {transactions.filter(t => t?.type === 'expense').length > 10 && (
            <CuriosityWidget
              title="Consistency Check"
              message="You're actively tracking expenses"
              detail={`Great job recording ${transactions.filter(t => t?.type === 'expense').length} expense transactions. Consistent tracking leads to better financial awareness.`}
              type="achievement"
              initialExpanded={false}
            />
          )}
        </motion.div>
      )}

      {/* Transactions List */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
            All Transactions {transactions?.length > 0 && `(${transactions.length})`}
          </h2>
          <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
        </GlassCard>
      </motion.div>

      {/* Confirmation Dialogs */}
      {confirmDialog.type === 'add-income' && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Confirm Income"
          message="Add this income transaction?"
          details={`Amount: ₹${confirmDialog.data?.amount?.toLocaleString('en-IN')} | Type: ${confirmDialog.data?.description}`}
          confirmText="Add Income"
          cancelText="Cancel"
          onConfirm={handleConfirmAdd}
          onCancel={() => setConfirmDialog({ isOpen: false, type: null, data: null, isLoading: false })}
          isLoading={confirmDialog.isLoading}
        />
      )}

      {confirmDialog.type === 'add-expense' && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Confirm Expense"
          message="Add this expense transaction?"
          details={`Amount: ₹${confirmDialog.data?.amount?.toLocaleString('en-IN')} | Category: ${confirmDialog.data?.category}`}
          confirmText="Add Expense"
          cancelText="Cancel"
          onConfirm={handleConfirmAdd}
          onCancel={() => setConfirmDialog({ isOpen: false, type: null, data: null, isLoading: false })}
          isLoading={confirmDialog.isLoading}
        />
      )}

      {confirmDialog.type === 'delete' && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This cannot be undone."
          details={`Amount: ₹${confirmDialog.data?.transaction?.amount?.toLocaleString('en-IN')} | Type: ${confirmDialog.data?.transaction?.type}`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, type: null, data: null, isLoading: false })}
          isLoading={confirmDialog.isLoading}
          isDangerous={true}
        />
      )}

    </motion.div>
  );
}
