import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

export default function AdvancedChart({ stocks = [] }) {
  const [timeframe, setTimeframe] = useState('1D');

  // Generate candlestick data
  const generateChartData = () => {
    const data = [];
    let basePrice = 18000;
    const now = new Date();

    for (let i = 60; i >= 0; i--) {
      const date = new Date(now);
      date.setMinutes(date.getMinutes() - i);
      const open = basePrice + (Math.random() - 0.5) * 100;
      const close = open + (Math.random() - 0.5) * 150;
      const high = Math.max(open, close) + Math.random() * 50;
      const low = Math.min(open, close) - Math.random() * 50;

      data.push({
        x: date.getTime(),
        y: [open, high, low, close]
      });

      basePrice = close;
    }
    return data;
  };

  const options = {
    chart: {
      type: 'candlestick',
      height: 400,
      sparkline: { enabled: false },
      toolbar: { show: false },
      background: 'transparent',
      foreColor: 'rgba(156, 163, 175, 1)',
    },
    xaxis: {
      type: 'datetime',
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: true, style: { colors: 'rgba(156, 163, 175, 0.7)' } },
    },
    yaxis: {
      labels: { style: { colors: 'rgba(156, 163, 175, 0.7)' } },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      padding: { left: 0, right: 0 },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981',
          downward: '#ef4444'
        },
        wick: { useFillColor: true },
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: { fontSize: '12px' },
      x: { format: 'dd MMM yyyy HH:mm' },
    },
    states: {
      hover: { filter: { type: 'none' } },
    },
  };

  const series = [{ data: generateChartData() }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl col-span-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Nifty 50 Index</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Live market movement</p>
        </div>

        <div className="flex gap-2">
          {['1D', '1W', '1M', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeframe === tf
                  ? 'gradient-brand text-white shadow-lg'
                  : 'glass hover:bg-white/10'
              }`}
              style={timeframe !== tf ? { color: 'var(--text-secondary)' } : {}}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        <Chart
          options={options}
          series={series}
          type="candlestick"
          height="100%"
        />
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4">
        {[
          { label: 'Open', value: '18,250.50' },
          { label: 'High', value: '18,420.75' },
          { label: 'Low', value: '18,180.25' },
          { label: 'Close', value: '18,385.40' },
          { label: 'Volume', value: '2.5B' },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
