"use client";
import React from 'react';

/**
 * PortfolioStats
 * A simple component that displays summary stats for a portfolio
 * Replace the dummy data with your real props/data
 */
export default function PortfolioStats({ totalDeals = 0, totalValue = 0, averageRisk = 0 }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      <div>
        <h3>Total Deals</h3>
        <p>{totalDeals}</p>
      </div>
      <div>
        <h3>Total Value</h3>
        <p>${totalValue.toLocaleString()}</p>
      </div>
      <div>
        <h3>Average Risk</h3>
        <p>{averageRisk}%</p>
      </div>
    </div>
  );
}