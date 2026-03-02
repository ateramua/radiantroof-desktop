'use client';
// components/DealScoreCard.jsx
import { calculateDealScore } from '@/lib/dealCalculations';
export default function DealScoreCard({ dealData }) {
  const score = calculateDealScore(dealData);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'INVESTIGATE - Strong Deal';
    if (score >= 60) return 'REVIEW - Check Details';
    return 'PASS -不符合 Criteria';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Deal Strength Score</h3>
        <span className="text-sm text-gray-500">Weighted against your criteria</span>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${score * 2.76} 276`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1">
          <div className={`text-xl font-semibold mb-2 ${getScoreColor(score)}`}>
            {getScoreMessage(score)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">ROI vs Target:</span>
              <span className="ml-2 font-medium text-green-600">✅</span>
            </div>
            <div>
              <span className="text-gray-600">DSCR:</span>
              <span className="ml-2 font-medium text-yellow-600">⚠️</span>
            </div>
            <div>
              <span className="text-gray-600">Cash Flow:</span>
              <span className="ml-2 font-medium text-green-600">✅</span>
            </div>
            <div>
              <span className="text-gray-600">MAO Compliance:</span>
              <span className="ml-2 font-medium text-green-600">✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}