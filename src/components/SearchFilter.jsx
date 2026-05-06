import React, { useState } from 'react';
import { searchTransactions } from '../utils/calculations';

export default function SearchFilter({ transactions, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchResults = searchTransactions(transactions, query);
    const filtered = filterCategory === 'All' ? searchResults : searchResults.filter(t => t.category === filterCategory || t.source === filterCategory);
    onSearchChange(filtered);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    const searchResults = searchTransactions(transactions, searchQuery);
    const filtered = category === 'All' ? searchResults : searchResults.filter(t => t.category === category || t.source === category);
    onSearchChange(filtered);
  };

  const categories = ['All', 'Needs', 'Wants', 'Savings & Investment', 'Salary', 'Freelance'];

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-bold">🔍 Search Transactions</h2>
      <div className="space-y-3">
        <input type="text" placeholder="Search by amount, category, or notes..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="input" />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategoryFilter(cat)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
    </div>
  );
}
