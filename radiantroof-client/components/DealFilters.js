'use client'; // MUST be first line for React hooks

import React, { useState } from 'react';

/**
 * DealFilters
 * A minimal filter component for deals.
 * Replace options and styling with real data/UI as needed.
 */
export default function DealFilters({ onFilterChange }) {
  const [status, setStatus] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    onFilterChange?.({ status: value, riskLevel });
  };

  const handleRiskChange = (e) => {
    const value = e.target.value;
    setRiskLevel(value);
    onFilterChange?.({ status, riskLevel: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div>
        <label>Status: </label>
        <select value={status} onChange={handleStatusChange}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label>Risk Level: </label>
        <select value={riskLevel} onChange={handleRiskChange}>
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}
