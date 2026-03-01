'use client';
// components/EmptyPortfolioState.js
import React from 'react';

export default function EmptyPortfolioState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        color: '#555',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Your portfolio is empty</h2>
      <p>Start adding deals to see them here!</p>
    </div>
  );
}