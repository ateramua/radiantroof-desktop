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
          <div className="relative">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold">Loading your inventory...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your properties</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Inventory</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Gradient */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-indigo-600 transition">Dashboard</Link>
                <span>›</span>
                <span className="text-indigo-600 font-medium">Inventory Management</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Property Inventory
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">{properties.length} total properties in inventory</span>
              </p>
            </div>
            
            {/* Add Property Button - Enhanced */}
            <Link
              href="/admin/properties/AddProperties"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium overflow-hidden"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">Add New Property</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Enhanced with better styling */}
        {properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Properties Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-indigo-500 group hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition">Total Properties</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                Across {stats.countries} {stats.countries === 1 ? 'country' : 'countries'}
              </div>
            </div>

            {/* Available Properties Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 group hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-green-600 transition">Available</p>
                  <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Ready for market
              </div>
            </div>

            {/* Average Price Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-yellow-500 group hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-yellow-600 transition">Average Price</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.avgPrice)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Range: {formatCurrency(stats.minPrice)} - {formatCurrency(stats.maxPrice)}
              </div>
            </div>

            {/* Total Value Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500 group hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-purple-600 transition">Total Value</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Portfolio worth
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 px-3 py-1 bg-indigo-50 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh List
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Available: {stats.available}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Pending: {stats.pending}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Sold: {stats.sold}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Properties Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {properties.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Your inventory is empty</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Get started by adding your first property to the inventory.</p>
              <Link
                href="/admin/properties/AddProperties"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Property
              </Link>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-indigo-900">Inventory List</h2>
                <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm text-indigo-700 font-medium">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </span>
              </div>
              <PropertiesTable 
                properties={properties} 
                onDelete={handleDelete}
                showAdminControls={true}
                formatCurrency={formatCurrency}
              />
            </>
          )}
        </div>

        {/* Footer Stats */}
        {properties.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm">
            <div className="text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{properties.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{properties.length}</span> properties
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}