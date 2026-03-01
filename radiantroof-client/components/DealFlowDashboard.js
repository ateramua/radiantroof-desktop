// components/DealFlowDashboard.jsx
'use client';
import { useState } from 'react';
import DealInputForm from './DealInputForm';
import DealMetricsDashboard from './DealMetricsDashboard';
import RiskMeter from './RiskMeter';
import DealScoreCard from './DealScoreCard';
import FormulaExplainer from './FormulaExplainer';
import LeadCaptureModal from './LeadCaptureModal';

export default function DealFlowDashboard() {
  const [dealData, setDealData] = useState({
    // Inputs
    arv: 425000,
    repairCosts: 45000,
    purchasePrice: 335000,
    monthlyRent: 2800,
    interestRate: 6.25,
    downPaymentPercent: 20,
    closingCosts: 8700,
    
    // Will be calculated
    metrics: {},
    dealScore: 0,
    riskLevel: 'moderate'
  });

  const [showLeadCapture, setShowLeadCapture] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormulaExplainer 
            title="ROI" 
            formula="Profit ÷ Total Cash Invested × 100"
            example="$36,300 ÷ $120,700 × 100 = 30.1%"
          />
          <FormulaExplainer 
            title="MAO" 
            formula="ARV − Repairs − Desired Profit"
            example="$425,000 − $45,000 − $40,000 = $340,000"
          />
          <FormulaExplainer 
            title="DSCR" 
            formula="NOI ÷ Debt Service"
            example="$20,880 ÷ $19,704 = 1.06"
          />
          <FormulaExplainer 
            title="Deal Score" 
            formula="∑(Parameter Score × Weight)"
            example="85/100 = INVESTIGATE"
          />
        </div>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            The RadiantROI Deal Engine
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stop guessing. Start calculating. Institutional-grade underwriting for every deal.
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-1">
          <DealInputForm dealData={dealData} setDealData={setDealData} />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          <DealScoreCard dealData={dealData} />
          <RiskMeter riskLevel={dealData.riskLevel} />
          <DealMetricsDashboard metrics={dealData.metrics} />
        </div>
      </div>

      {/* Formula Transparency Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          How We Calculate <span className="text-blue-600">Every Number</span>
        </h2>
   
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal 
        isOpen={showLeadCapture} 
        onClose={() => setShowLeadCapture(false)}
        dealData={dealData}
      />
    </div>
  );
}