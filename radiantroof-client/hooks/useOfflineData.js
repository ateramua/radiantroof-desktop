// hooks/useOfflineData.js
'use client';

import { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

export function useOfflineProperties() {
  const { db, isInitialized } = useDatabase();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProperties = async () => {
    if (!isInitialized || !db) return;
    setLoading(true);
    try {
      const data = await db.getAll('properties');
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProperty = async (property) => {
    if (!isInitialized || !db) return;
    try {
      await db.store('properties', property);
      await loadProperties(); // Refresh list
    } catch (error) {
      console.error('Failed to save property:', error);
    }
  };

  const deleteProperty = async (id) => {
    if (!isInitialized || !db) return;
    try {
      await db.delete('properties', id);
      await loadProperties(); // Refresh list
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [isInitialized, db]);

  return { properties, loading, saveProperty, deleteProperty, loadProperties };
}

export function useOfflineUsers() {
  const { db, isInitialized } = useDatabase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    if (!isInitialized || !db) return;
    setLoading(true);
    try {
      const data = await db.getAll('users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (user) => {
    if (!isInitialized || !db) return;
    try {
      await db.store('users', user);
      await loadUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [isInitialized, db]);

  return { users, loading, saveUser, loadUsers };
}

export function useOfflineDeals() {
  const { db, isInitialized } = useDatabase();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDeals = async () => {
    if (!isInitialized || !db) return;
    setLoading(true);
    try {
      const data = await db.getAll('deals');
      setDeals(data);
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDeal = async (deal) => {
    if (!isInitialized || !db) return;
    try {
      await db.store('deals', deal);
      await loadDeals();
    } catch (error) {
      console.error('Failed to save deal:', error);
    }
  };

  useEffect(() => {
    loadDeals();
  }, [isInitialized, db]);

  return { deals, loading, saveDeal, loadDeals };
}