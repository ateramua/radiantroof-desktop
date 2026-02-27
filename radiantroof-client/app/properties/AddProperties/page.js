"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../lib/api"; // Make sure this path is correct

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    address: "",
    country: "USA",
    description: "",
    price: "",
    photo: "",
    status: "Available",
    screening: "{}",
    analysis: "{}",
    decision: "{}",
    acquisition: "{}"
  });

  const [jsonErrors, setJsonErrors] = useState({
    screening: false,
    analysis: false,
    decision: false,
    acquisition: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate JSON fields
    if (['screening', 'analysis', 'decision', 'acquisition'].includes(name)) {
      try {
        JSON.parse(value || '{}');
        setJsonErrors(prev => ({ ...prev, [name]: false }));
      } catch {
        setJsonErrors(prev => ({ ...prev, [name]: true }));
      }
    }
  };

  const validateJsonFields = () => {
    const jsonFields = ['screening', 'analysis', 'decision', 'acquisition'];
    let valid = true;
    const newErrors = { ...jsonErrors };

    jsonFields.forEach(field => {
      try {
        JSON.parse(formData[field] || '{}');
        newErrors[field] = false;
      } catch {
        newErrors[field] = true;
        valid = false;
      }
    });

    setJsonErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate JSON fields first
    if (!validateJsonFields()) {
      setError("Please fix JSON formatting errors");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Parse JSON fields
    const propertyData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      screening: JSON.parse(formData.screening || '{}'),
      analysis: JSON.parse(formData.analysis || '{}'),
      decision: JSON.parse(formData.decision || '{}'),
      acquisition: JSON.parse(formData.acquisition || '{}')
    };

    try {
      await api.post("/properties", propertyData);
      setSuccess("Property added successfully!");
      
      // Reset form after successful submission
      setFormData({
        address: "",
        country: "USA",
        description: "",
        price: "",
        photo: "",
        status: "Available",
        screening: "{}",
        analysis: "{}",
        decision: "{}",
        acquisition: "{}"
      });

      // Redirect to properties list after 2 seconds
      setTimeout(() => {
        router.push("/admin/properties");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to add property");
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
            <Link href="/admin/properties" className="hover:text-blue-600 transition">Properties</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">Add Property</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Property
          </h1>
          <p className="text-gray-600 mt-1">Fill in the details below to add a property to the system</p>
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

                {/* Country */}
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

                {/* Price */}
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

            {/* JSON Data Section */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Workflow Data (JSON)
              </h2>
              <p className="text-sm text-gray-500 mb-4">Enter valid JSON for each workflow stage</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Screening */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screening Data
                    {jsonErrors.screening && (
                      <span className="ml-2 text-xs text-red-500">Invalid JSON</span>
                    )}
                  </label>
                  <textarea
                    name="screening"
                    value={formData.screening}
                    onChange={handleChange}
                    rows="5"
                    placeholder='{"criteria": {"minPrice": 100000}, "results": {"score": 85}}'
                    className={`w-full font-mono text-sm border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition ${
                      jsonErrors.screening ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Analysis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Data
                    {jsonErrors.analysis && (
                      <span className="ml-2 text-xs text-red-500">Invalid JSON</span>
                    )}
                  </label>
                  <textarea
                    name="analysis"
                    value={formData.analysis}
                    onChange={handleChange}
                    rows="5"
                    placeholder='{"roi": 12.5, "cashflow": 1500, "capRate": 8.2}'
                    className={`w-full font-mono text-sm border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition ${
                      jsonErrors.analysis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Decision */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision Data
                    {jsonErrors.decision && (
                      <span className="ml-2 text-xs text-red-500">Invalid JSON</span>
                    )}
                  </label>
                  <textarea
                    name="decision"
                    value={formData.decision}
                    onChange={handleChange}
                    rows="5"
                    placeholder='{"approved": true, "notes": "Great investment opportunity"}'
                    className={`w-full font-mono text-sm border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition ${
                      jsonErrors.decision ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Acquisition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acquisition Data
                    {jsonErrors.acquisition && (
                      <span className="ml-2 text-xs text-red-500">Invalid JSON</span>
                    )}
                  </label>
                  <textarea
                    name="acquisition"
                    value={formData.acquisition}
                    onChange={handleChange}
                    rows="5"
                    placeholder='{"date": "2024-06-15", "terms": {"downPayment": 20, "loanTerm": 30}}'
                    className={`w-full font-mono text-sm border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition ${
                      jsonErrors.acquisition ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="p-8 bg-gray-50 flex items-center justify-end gap-4">
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
                    Adding Property...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Property
                  </>
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
            JSON Format Tips
          </h3>
          <p className="text-xs text-blue-700">
            Use valid JSON format for workflow data. Example: {"{"}"key": "value"{"}"}. 
            Leave as {"{"}{"}"} if no data is available.
          </p>
        </div>
      </div>
    </div>
  );
}