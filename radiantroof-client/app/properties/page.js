"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getProperties } from "../../lib/api";
import PropertiesTable from "../../components/PropertiesTable";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    forSale: false,
    pending: false,
    sold: false
  });

  // Fetch properties on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getProperties();
        if (isMounted) {
          setProperties(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load properties");
          console.error("Error fetching properties:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  }, []);

  // Format currency with fallback
  const formatCurrency = useCallback((value) => {
    if (!value && value !== 0) return '$0';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } catch {
      return `$${value}`;
    }
  }, []);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    if (!filters.forSale && !filters.pending && !filters.sold) {
      return properties;
    }
    
    return properties.filter(property => {
      const status = property?.status;
      if (filters.forSale && status === 'Available') return true;
      if (filters.pending && status === 'Pending') return true;
      if (filters.sold && status === 'Sold') return true;
      return false;
    });
  }, [properties, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const defaultStats = {
      total: 0,
      available: 0,
      pending: 0,
      sold: 0,
      totalValue: 0,
      avgPrice: 0,
      countries: 0,
      minPrice: 0,
      maxPrice: 0
    };

    if (!properties.length) return defaultStats;

    try {
      const total = properties.length;
      const available = properties.filter(p => p?.status === 'Available').length;
      const pending = properties.filter(p => p?.status === 'Pending').length;
      const sold = properties.filter(p => p?.status === 'Sold').length;
      
      const totalValue = properties.reduce((acc, p) => {
        const price = Number(p?.price) || 0;
        return acc + price;
      }, 0);
      
      const avgPrice = total > 0 ? Math.round(totalValue / total) : 0;
      
      const countriesSet = new Set();
      properties.forEach(p => {
        if (p?.country) countriesSet.add(p.country);
      });
      const countries = countriesSet.size || 1;
      
      const prices = properties
        .map(p => Number(p?.price) || 0)
        .filter(price => price > 0);
      
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;
      
      return { total, available, pending, sold, totalValue, avgPrice, countries, minPrice, maxPrice };
    } catch (err) {
      console.error("Error calculating stats:", err);
      return defaultStats;
    }
  }, [properties]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading properties...</p>
          <p className="text-sm text-gray-400">Please wait while we fetch the latest listings</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section with Stats */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Property Listings
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} available
                </span>
              </p>
            </div>
            
            {/* Filter Indicators */}
            <div className="flex flex-wrap gap-2">
              {filters.forSale && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  For Sale
                  <button 
                    onClick={() => handleFilterChange('forSale')}
                    className="ml-1 text-green-600 hover:text-green-800"
                    aria-label="Remove filter"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.pending && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pending
                  <button 
                    onClick={() => handleFilterChange('pending')}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                    aria-label="Remove filter"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.sold && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Sold
                  <button 
                    onClick={() => handleFilterChange('sold')}
                    className="ml-1 text-red-600 hover:text-red-800"
                    aria-label="Remove filter"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Summary Stats Cards */}
          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Properties Card */}
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 group-hover:text-blue-600 transition">Total Properties</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Across {stats.countries} {stats.countries === 1 ? 'country' : 'countries'}
                </div>
              </div>

              {/* Available Properties Card */}
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 group hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 group-hover:text-green-600 transition">Available</p>
                    <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Ready for purchase
                </div>
              </div>

              {/* Average Price Card */}
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100 group hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 group-hover:text-yellow-600 transition">Average Price</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.avgPrice)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Range: {formatCurrency(stats.minPrice)} - {formatCurrency(stats.maxPrice)}
                </div>
              </div>

              {/* Total Value Card */}
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 group-hover:text-purple-600 transition">Total Value</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Portfolio worth
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content with Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:sticky lg:top-24 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter Properties
                {(filters.forSale || filters.pending || filters.sold) && (
                  <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </h3>
              
              <div className="space-y-3">
                {/* For Sale Filter */}
                <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group border-2 border-transparent hover:border-green-200">
                  <input
                    type="checkbox"
                    checked={filters.forSale}
                    onChange={() => handleFilterChange('forSale')}
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-offset-0"
                  />
                  <span className="ml-3 flex-1 text-gray-700 group-hover:text-green-600 transition font-medium">
                    For Sale
                  </span>
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full group-hover:bg-green-200 group-hover:text-green-800 transition">
                    {stats.available}
                  </span>
                </label>

                {/* Pending Filter */}
                <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group border-2 border-transparent hover:border-yellow-200">
                  <input
                    type="checkbox"
                    checked={filters.pending}
                    onChange={() => handleFilterChange('pending')}
                    className="w-4 h-4 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500 focus:ring-offset-0"
                  />
                  <span className="ml-3 flex-1 text-gray-700 group-hover:text-yellow-600 transition font-medium">
                    Pending
                  </span>
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full group-hover:bg-yellow-200 group-hover:text-yellow-800 transition">
                    {stats.pending}
                  </span>
                </label>

                {/* Sold Filter */}
                <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group border-2 border-transparent hover:border-red-200">
                  <input
                    type="checkbox"
                    checked={filters.sold}
                    onChange={() => handleFilterChange('sold')}
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 focus:ring-offset-0"
                  />
                  <span className="ml-3 flex-1 text-gray-700 group-hover:text-red-600 transition font-medium">
                    Sold
                  </span>
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full group-hover:bg-red-200 group-hover:text-red-800 transition">
                    {stats.sold}
                  </span>
                </label>
              </div>

              {/* Quick Stats */}
              {properties.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quick Stats
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Price Range</span>
                      <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                        {formatCurrency(stats.minPrice)} - {formatCurrency(stats.maxPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Countries</span>
                      <span className="font-medium text-gray-900 bg-white px-4 py-1 rounded-full shadow-sm">
                        {stats.countries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Availability Rate</span>
                      <span className="font-medium text-gray-900 bg-white px-4 py-1 rounded-full shadow-sm">
                        {Math.round((stats.available / stats.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters Summary */}
              {(filters.forSale || filters.pending || filters.sold) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-600">Active Filters</h4>
                    <button
                      onClick={() => setFilters({ forSale: false, pending: false, sold: false })}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filters.forSale && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">For Sale</span>
                        <span className="text-green-600 font-medium">{stats.available} properties</span>
                      </div>
                    )}
                    {filters.pending && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Pending</span>
                        <span className="text-yellow-600 font-medium">{stats.pending} properties</span>
                      </div>
                    )}
                    {filters.sold && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Sold</span>
                        <span className="text-red-600 font-medium">{stats.sold} properties</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reset Filters Button */}
              {(filters.forSale || filters.pending || filters.sold) && (
                <button
                  onClick={() => setFilters({ forSale: false, pending: false, sold: false })}
                  className="mt-6 w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Properties Table - Using shared component */}
          <div className="lg:w-3/4">
            <PropertiesTable 
              properties={filteredProperties} 
              showAdminControls={false}
              formatCurrency={formatCurrency}
            />
            
            {/* Results Summary */}
            {filteredProperties.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                <div className="text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  Showing <span className="font-semibold text-blue-600">{filteredProperties.length}</span> of{' '}
                  <span className="font-semibold text-gray-700">{properties.length}</span> properties
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click on any row to view details
                  </span>
                  <span className="text-gray-400 text-xs">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}