"use client";
import { useState } from 'react';
import { createDeal } from '@/lib/sourcing/models';
import { ScoringEngine } from '@/lib/sourcing/scoringEngine';

export default function DealImport({ onDealsImported }) {
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [mapping, setMapping] = useState({
    address: 'A',
    askingPrice: 'B',
    arv: 'C',
    repairs: 'D',
    ownerName: 'E',
    ownerPhone: 'F'
  });
  const [results, setResults] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImporting(true);
    
    // Use PapaParse or similar for CSV parsing
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      // Parse data
      const data = [];
      for (let i = 1; i < Math.min(lines.length, 11); i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const row = {};
          headers.forEach((header, idx) => {
            row[header.trim()] = values[idx]?.trim() || '';
          });
          data.push(row);
        }
      }
      
      setPreviewData(data);
      setImporting(false);
    };
    
    reader.readAsText(file);
  };

  const processImports = () => {
    const scoringEngine = new ScoringEngine();
    const imported = [];
    const errors = [];
    
    previewData.forEach((row, index) => {
      try {
        // Map columns based on user selection
        const deal = createDeal({
          address: row[mapping.address] || '',
          askingPrice: parseFloat(row[mapping.askingPrice]) || 0,
          estimatedArv: parseFloat(row[mapping.arv]) || 0,
          estimatedRepairs: parseFloat(row[mapping.repairs]) || 0,
          ownerName: row[mapping.ownerName] || '',
          ownerPhone: row[mapping.ownerPhone] || '',
          sourceType: 'manual',
          sourceDetail: 'CSV Import'
        });
        
        // Score the deal
        const scored = scoringEngine.scoreDeal(deal);
        deal.score = scored.score;
        deal.priority = scored.priority;
        deal.scoringFactors = scored.factors;
        
        imported.push(deal);
      } catch (err) {
        errors.push(`Row ${index + 2}: ${err.message}`);
      }
    });
    
    setResults({ imported: imported.length, errors });
    
    if (onDealsImported) {
      onDealsImported(imported);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">📥 Import Deals from CSV</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer inline-block"
        >
          <div className="text-4xl mb-2">📂</div>
          <p className="text-blue-600 hover:underline">Click to upload CSV</p>
          <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
        </label>
      </div>

      {previewData.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Preview First 10 Rows</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {Object.keys(previewData[0] || {}).map(header => (
                    <th key={header} className="px-3 py-2 text-left">
                      {header}
                      <select
                        value={mapping[header] || ''}
                        onChange={(e) => setMapping({...mapping, [header]: e.target.value})}
                        className="block w-full text-xs mt-1 border rounded"
                      >
                        <option value="">Ignore</option>
                        <option value="address">Address</option>
                        <option value="askingPrice">Asking Price</option>
                        <option value="arv">ARV</option>
                        <option value="repairs">Repairs</option>
                        <option value="ownerName">Owner Name</option>
                        <option value="ownerPhone">Owner Phone</option>
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-3 py-2">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={processImports}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Import {previewData.length} Deals
          </button>

          {results && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p>✅ Successfully imported {results.imported} deals</p>
              {results.errors.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  {results.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}