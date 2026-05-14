// components/OfflineProperties.js
'use client';

import { useState } from 'react';
import { useOfflineProperties } from '../hooks/useOfflineData';

export default function OfflineProperties() {
  const { properties, loading, saveProperty, deleteProperty } = useOfflineProperties();
  const [newProperty, setNewProperty] = useState({ address: '', price: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const property = {
      id: Date.now().toString(),
      ...newProperty,
      price: parseFloat(newProperty.price)
    };
    await saveProperty(property);
    setNewProperty({ address: '', price: '', description: '' });
  };

  const handleDelete = async (id) => {
    await deleteProperty(id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Offline Properties</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Add New Property</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Address"
            value={newProperty.address}
            onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProperty.price}
            onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProperty.description}
            onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Property
        </button>
      </form>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Stored Properties</h3>
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : properties.length === 0 ? (
          <p className="p-4">No offline properties stored.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{property.address}</p>
                  <p className="text-gray-600">${property.price?.toLocaleString()}</p>
                  {property.description && <p className="text-sm text-gray-500">{property.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}