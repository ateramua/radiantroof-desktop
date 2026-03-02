"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from 'papaparse'; // You'll need to install this: npm install papaparse

export default function BulkImportPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setError("");

    // Parse CSV for preview
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Error parsing CSV file. Please check the format.");
          console.error(results.errors);
        } else {
          setPreview(results.data.slice(0, 5)); // Show first 5 rows
        }
      },
      error: (err) => {
        setError("Failed to parse CSV file: " + err.message);
      }
    });
  };

  const downloadTemplate = () => {
    const headers = [
      'address',
      'country',
      'description',
      'price',
      'photo',
      'status',
      'screening',
      'analysis',
      'decision',
      'acquisition'
    ].join(',');

    const sampleRow = [
      '123 Main St',
      'USA',
      'Beautiful property with great views',
      '500000',
      'https://example.com/photo.jpg',
      'Available',
      '{}',
      '{}',
      '{}',
      '{}'
    ].join(',');

    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'property-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    setImporting(true);
    setError("");
    setSuccess("");

    try {
      const results = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject
        });
      });

      const properties = results.data;
      let successCount = 0;
      let errorCount = 0;

      // Process each property
      for (const property of properties) {
        try {
          // Validate required fields
          if (!property.address || !property.price) {
            errorCount++;
            continue;
          }

          // Parse JSON fields
          const propertyData = {
            address: property.address,
            country: property.country || 'USA',
            description: property.description || '',
            price: parseFloat(property.price) || 0,
            photo: property.photo || '',
            status: property.status || 'Available',
            screening: property.screening ? JSON.parse(property.screening) : {},
            analysis: property.analysis ? JSON.parse(property.analysis) : {},
            decision: property.decision ? JSON.parse(property.decision) : {},
            acquisition: property.acquisition ? JSON.parse(property.acquisition) : {}
          };

          const response = await fetch('http://localhost:5001/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
        }
      }

      setSuccess(`Import completed! ${successCount} properties added successfully. ${errorCount} failed.`);
      setFile(null);
      setPreview([]);
      
      // Clear file input
      document.getElementById('file-upload').value = '';

    } catch (err) {
      setError("Failed to process CSV file: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-indigo-600 transition">Dashboard</Link>
            <span>›</span>
            <Link href="/admin/properties" className="hover:text-indigo-600 transition">Inventory</Link>
            <span>›</span>
            <span className="text-indigo-600 font-medium">Bulk Import</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bulk Import Properties
          </h1>
          <p className="text-gray-600 mt-2">Upload a CSV file to add multiple properties at once</p>
        </div>

        {/* Template Download */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Step 1: Download Template</h2>
              <p className="text-sm text-gray-500 mt-1">Start with our CSV template to ensure correct formatting</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Template
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Upload Your CSV File</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition">
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-600">
                {file ? file.name : 'Click to select a CSV file or drag and drop'}
              </span>
              {file && (
                <span className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {preview.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview (First 5 Rows)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(preview[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2 text-gray-600">
                          {String(value).substring(0, 50)}
                          {String(value).length > 50 ? '...' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Import Button */}
        <div className="flex gap-4">
          <button
            onClick={handleBulkImport}
            disabled={!file || importing}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Importing...
              </span>
            ) : (
              'Start Import'
            )}
          </button>
          <Link
            href="/admin/properties/AddProperties"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-800 mb-2">CSV Format Tips</h3>
          <ul className="text-xs text-indigo-700 space-y-1 list-disc pl-4">
            <li>Required columns: address, price</li>
            <li>Optional columns: country, description, photo, status</li>
            <li>JSON fields (screening, analysis, decision, acquisition) should be valid JSON strings</li>
            <li>Leave JSON fields as {{}} if no data</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}