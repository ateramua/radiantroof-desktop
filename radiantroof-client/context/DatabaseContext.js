// context/DatabaseContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import EncryptedDatabase from '../lib/encryptedDatabase';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  const initializeDatabase = async (password) => {
    try {
      const database = new EncryptedDatabase();
      await database.init(password);
      setDb(database);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeDatabase = () => {
    if (db) {
      db.close();
      setDb(null);
      setIsInitialized(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{
      db,
      isInitialized,
      error,
      initializeDatabase,
      closeDatabase
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}