"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Simple form state - all fields are strings
  const [formData, setFormData] = useState({
    address: "",
    country: "USA",
    description: "",
    price: "",
    photo: "",
    status: "Available",
    screening: "",
    analysis: "",
    decision: "",
    acquisition: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Simple validation
  const validateForm = () => {
    if (!formData.address.trim()) {
      setError("Address is required");
      return false;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return false;
    }
    
    return true;
  };

  // Safe JSON parser
  const safeJsonParse = (str) => {
    if (!str || str.trim() === "") return {};
    try {
      return JSON.parse(str);
    } catch {
      return {};
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError("");
    setSuccess("");
    
    // Validate
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Prepare data for API
    const propertyData = {
      address: formData.address.trim(),
      country: formData.country || "USA",
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      photo: formData.photo.trim(),
      status: formData.status,
      screening: safeJsonParse(formData.screening),
      analysis: safeJsonParse(formData.analysis),
      decision: safeJsonParse(formData.decision),
      acquisition: safeJsonParse(formData.acquisition)
    };

    try {
      // Simple fetch instead of api import
      const response = await fetch('http://localhost:5001/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add property');
      }
      
      setSuccess("Property added successfully!");
      
      // Reset form
      setFormData({
        address: "",
        country: "USA",
        description: "",
        price: "",
        photo: "",
        status: "Available",
        screening: "",
        analysis: "",
        decision: "",
        acquisition: ""
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/properties");
      }, 2000);

    } catch (err) {
      setError(err.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-blue-600 transition">Dashboard</Link>
            <span>›</span>
            <Link href="/admin/properties" className="hover:text-blue-600 transition">Inventory</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">Add Property</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Property
              </h1>
              <p className="text-gray-600 mt-1">Fill in the details below to add a property to the system</p>
            </div>
            
            {/* Simplified button group - only two options */}
            <div className="flex gap-3">
              <Link
                href="/admin/properties/AddProperties/BulkImport"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Bulk Import
              </Link>
              <Link
                href="/admin/properties/AddProperties"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Property
              </Link>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Main Street"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                </div>

                {/* Country and Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="USA"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="1000"
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Contract">Under Contract</option>
                  </select>
                </div>

                {/* Photo URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="https://example.com/property-image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter property description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition resize-y"
                  />
                </div>
              </div>
            </div>

            {/* JSON Fields */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Workflow Data (Optional JSON)
              </h2>
              <p className="text-sm text-gray-500 mb-4">Enter valid JSON or leave empty</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Screening</label>
                  <textarea
                    name="screening"
                    value={formData.screening}
                    onChange={handleChange}
                    rows="3"
                    placeholder='{"criteria": {"minPrice": 100000}}'
                    className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis</label>
                  <textarea
                    name="analysis"
                    value={formData.analysis}
                    onChange={handleChange}
                    rows="3"
                    placeholder='{"roi": 12.5, "capRate": 8.2}'
                    className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                  <textarea
                    name="decision"
                    value={formData.decision}
                    onChange={handleChange}
                    rows="3"
                    placeholder='{"approved": true, "notes": "Good investment"}'
                    className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition</label>
                  <textarea
                    name="acquisition"
                    value={formData.acquisition}
                    onChange={handleChange}
                    rows="3"
                    placeholder='{"date": "2024-06-15", "terms": {"downPayment": 20}}'
                    className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="p-8 bg-gray-50 flex justify-end gap-4">
              <Link
                href="/admin/properties"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Property"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Tips
          </h3>
          <p className="text-xs text-blue-700">
            Required fields are marked with *. JSON fields can be left empty.
          </p>
        </div>
      </div>
    </div>
  );
}