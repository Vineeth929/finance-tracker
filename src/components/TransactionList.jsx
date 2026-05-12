import React from 'react';

export default function TransactionList({ transactions, onDelete }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet. Start by adding income or expenses!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">📋 Transactions</h2>
      <div className="space-y-2">
        {sorted.map(tx => (
          <div
            key={tx.id}
            className="card flex justify-between items-start hover:shadow-lg transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg ${tx.type === 'income' ? '💵' : '💳'}`} />
                <p className="font-semibold text-base">
                  {tx.type === 'income' ? tx.source : tx.subcategory}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tx.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                }`}>
                  {tx.type === 'income' ? 'Income' : tx.category}
                </span>
              </div>

              {tx.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{tx.notes}</p>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(tx.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </p>
              <button
                onClick={() => onDelete(tx._id, tx)}
                className="btn btn-secondary text-red-600 dark:text-red-400 px-2 py-1 text-sm hover:opacity-80 transition-opacity"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
