"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertiesTable from "@/components/PropertiesTable";
import { getProperties } from "@/lib/api";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    totalValue: 0,
    avgPrice: 0,
    countries: 0,
    minPrice: 0,
    maxPrice: 0
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
      calculateStats(data);
    } catch (err) {
      setError("Failed to load properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const available = data.filter(p => p?.status === 'Available').length;
    const pending = data.filter(p => p?.status === 'Pending').length;
    const sold = data.filter(p => p?.status === 'Sold').length;
    const totalValue = data.reduce((acc, p) => acc + (Number(p?.price) || 0), 0);
    const avgPrice = total > 0 ? totalValue / total : 0;
    const countries = new Set(data.map(p => p?.country || 'USA')).size;
    const prices = data.map(p => Number(p?.price) || 0).filter(price => price > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    setStats({ total, available, pending, sold, totalValue, avgPrice, countries, minPrice, maxPrice });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const api = (await import('@/lib/api')).default;
      await api.delete(`/properties/${id}`);
      fetchProperties(); // Refresh the list
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Property Management</h1>
              <p className="text-gray-600">Manage all properties in the system</p>
            </div>
            <Link
              href="/admin/properties/AddProperties"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Property
            </Link>
          </div>

          {/* Stats Cards */}
          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow border border-blue-100">
                <p className="text-sm text-gray-500 mb-1">Total Properties</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border border-yellow-100">
                <p className="text-sm text-gray-500 mb-1">Average Price</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.avgPrice)}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border border-purple-100">
                <p className="text-sm text-gray-500 mb-1">Total Value</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Properties Table with Admin Controls */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No properties found</p>
            <Link
              href="/admin/properties/AddProperties"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <PropertiesTable 
            properties={properties} 
            onDelete={handleDelete}
            showAdminControls={true}
          />
        )}
      </div>
    </div>
  );
}