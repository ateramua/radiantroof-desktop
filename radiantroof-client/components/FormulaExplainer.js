// components/investors/DealFlowDashboard/FormulaExplainer.jsx
'use client';
import { useState } from 'react';

export default function FormulaExplainer({ title, formula, example, description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Icon mapping based on formula title
  const getIcon = (title) => {
    const icons = {
      'ROI': '📈',
      'MAO': '💰',
      'DSCR': '🛡️',
      'Deal Score': '🎯',
      'Cap Rate': '🏢',
      'Cash-on-Cash': '💵',
      'Cash Flow': '💧',
      'NOI': '📊',
      'ARV': '🏠',
      'Variance': '📉',
      'Criteria Score': '⚖️',
      'Risk Level': '⚠️'
    };
    return icons[title] || '🔢';
  };

  // Color mapping based on formula type
  const getGradient = (title) => {
    const gradients = {
      'ROI': 'from-green-500 to-emerald-600',
      'MAO': 'from-blue-500 to-indigo-600',
      'DSCR': 'from-purple-500 to-pink-600',
      'Deal Score': 'from-yellow-500 to-orange-600',
      'Cap Rate': 'from-teal-500 to-cyan-600',
      'default': 'from-gray-600 to-gray-700'
    };
    return gradients[title] || gradients.default;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header - Always Visible */}
      <div 
        className={`p-4 cursor-pointer bg-gradient-to-r ${getGradient(title)} text-white`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getIcon(title)}</span>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              Formula
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-gray-50">
          {/* Formula */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Formula
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm text-gray-800">
              {formula}
            </div>
          </div>

          {/* Example with Numbers */}
          {example && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Example Calculation
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="font-mono text-sm text-gray-800 break-all">
                  {example}
                </div>
              </div>
            </div>
          )}

          {/* Description / Why It Matters */}
          {description && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Why It Matters
              </div>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                {description}
              </p>
            </div>
          )}

          {/* Interactive Mini Calculator (for some formulas) */}
          {title === 'ROI' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <span>⚡</span> Try quick calculation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Always visible footer with quick reference */}
      <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
        <span className="font-mono">{formula.split('=')[0].trim()}</span>
        <span className="text-gray-400">click to {isExpanded ? 'collapse' : 'expand'}</span>
      </div>
    </div>
  );
}