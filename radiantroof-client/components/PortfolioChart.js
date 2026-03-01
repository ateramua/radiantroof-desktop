// components/PortfolioChart.js
'use client'; // MUST be first line

import React from 'react';

/**
 * PortfolioChart
 * Minimal placeholder chart component
 * Replace with a charting library like Chart.js or Recharts later
 */
export default function PortfolioChart({ data = [] }) {
  if (data.length === 0) {
    return <div>No chart data available.</div>;
  }

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif',
      }}
    >
      <h3>Portfolio Chart</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.label}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}