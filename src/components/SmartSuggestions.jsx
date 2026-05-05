import React from 'react';

export default function SmartSuggestions({ suggestions }) {
  if (suggestions.length === 0) {
    return (
      <div className="card bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
        <p className="text-green-800 dark:text-green-100">✅ Great job! You're on track with your finances.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">💡 Smart Suggestions</h2>
      {suggestions.map((suggestion, idx) => (
        <div
          key={idx}
          className={`card ${
            suggestion.type === 'warning'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
              : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
          }`}
        >
          <p className={suggestion.type === 'warning' ? 'text-yellow-800 dark:text-yellow-100' : 'text-blue-800 dark:text-blue-100'}>
            {suggestion.message}
          </p>
        </div>
      ))}
    </div>
  );
}
