// components/DatabaseInitializer.js
'use client';

import { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';

export default function DatabaseInitializer() {
  const { isInitialized, error, initializeDatabase } = useDatabase();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initializeDatabase(password);
    } catch (err) {
      console.error('Failed to initialize database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialized) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Initialize Offline Database</h2>
        <p className="mb-4 text-gray-600">
          Enter a password to encrypt your offline data. This password will be required to access stored data.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Initializing...' : 'Initialize Database'}
          </button>
        </form>
      </div>
    </div>
  );
}