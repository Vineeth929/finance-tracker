import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { getMonthlyTrends, calculateByCategory, filterByMonth } from '../utils/calculations';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Analytics({ transactions, selectedMonth }) {
  const trends = getMonthlyTrends(transactions);
  const monthlyLabels = Object.keys(trends);
  const monthlyIncomes = monthlyLabels.map(m => trends[m].income);
  const monthlyExpenses = monthlyLabels.map(m => trends[m].expenses);
  const monthlySavings = monthlyLabels.map(m => trends[m].savings);

  const filtered = filterByMonth(transactions, selectedMonth);
  const categoryData = calculateByCategory(filtered);

  const barChartData = {
    labels: monthlyLabels.map(m => {
      const [year, month] = m.split('-');
      return new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
    }),
    datasets: [
      { label: 'Income', data: monthlyIncomes, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1 },
      { label: 'Expenses', data: monthlyExpenses, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 1 },
      { label: 'Savings', data: monthlySavings, backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }
    ]
  };

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(14, 165, 233, 0.8)'],
      borderColor: ['rgba(139, 92, 246, 1)', 'rgba(236, 72, 153, 1)', 'rgba(14, 165, 233, 1)'],
      borderWidth: 2
    }]
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">📊 Analytics & Trends</h2>
      <div className="card"><h3 className="text-lg font-bold mb-6">6-Month Trends</h3><div style={{ position: 'relative', height: '300px' }}><Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `₹${ctx.parsed.y.toFixed(2)}` } } }, scales: { y: { beginAtZero: true } } }} /></div></div>
      {Object.keys(categoryData).length > 0 && <div className="card"><h3 className="text-lg font-bold mb-6">Spending by Category</h3><div style={{ maxWidth: '400px', margin: '0 auto' }}><Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} /></div></div>}
    </div>
  );
}
