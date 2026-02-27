"use client";
import React, { useEffect, useState } from "react";
import { getProperties } from "../../lib/api";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Properties</h1>
          <p className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-800 font-mono">
                        {property.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {property.address || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {property.country || 'USA'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        <p className="truncate">{property.description || 'No description'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        {property.price ? `$${Number(property.price).toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <p className="text-lg mb-2">No properties found</p>
                        <p className="text-sm text-gray-400">Add some properties to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {properties.length > 0 && (
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Total Properties</h3>
              <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Average Price</h3>
              <p className="text-2xl font-bold text-green-600">
                ${properties.length > 0 
                  ? (properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / properties.length).toLocaleString(undefined, {maximumFractionDigits: 0})
                  : '0'
                }
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Countries</h3>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(properties.map(p => p.country || 'USA')).size}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-orange-600">
                ${properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}