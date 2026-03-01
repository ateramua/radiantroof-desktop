"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Formula Explainer Component
const FormulaExplainer = ({ title, formula, value, status, color, example }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-2xl font-bold mb-1" style={{ color: color || '#2563eb' }}>{value}</p>
    <p className="text-xs text-gray-400 mb-2">{formula}</p>
    {status && (
      <span className={`text-xs px-2 py-1 rounded-full ${
        status === 'Excellent' ? 'bg-green-100 text-green-800' :
        status === 'Good' ? 'bg-blue-100 text-blue-800' :
        status === 'Investigate' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    )}
    <p className="text-xs text-gray-300 mt-1">ex: {example}</p>
  </div>
);

export default function QuickDealCalculator({ isOpen, onClose }) {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "TX",
    askingPrice: "",
    arv: "",
    repairs: "",
    monthlyRent: "",
    desiredProfit: "40000"
  });

  // Parameter scores for Deal Score
  const [parameterScores, setParameterScores] = useState({
    location: 85,
    condition: 70,
    market: 90,
    numbers: 75,
    exit: 80
  });

  // Weights for Deal Score
  const weights = {
    location: 30,
    condition: 20,
    market: 25,
    numbers: 15,
    exit: 10
  };

  // Results state
  const [calculations, setCalculations] = useState({
    // ROI Components
    totalInvestment: 0,
    totalCashInvested: 0,
    loanAmount: 0,
    pointsCost: 0,
    monthlyInterest: 0,
    totalFinancingCost: 0,
    totalEquity: 0,
    grossProfit: 0,
    roi: 0,
    
    // MAO
    mao: 0,
    
    // DSCR Components
    grossRentalIncome: 0,
    vacancyLoss: 0,
    effectiveGrossIncome: 0,
    operatingExpenses: 0,
    netOperatingIncome: 0,
    annualDebtService: 0,
    dscr: 0,
    
    // Deal Score
    weightedLocation: 0,
    weightedCondition: 0,
    weightedMarket: 0,
    weightedNumbers: 0,
    weightedExit: 0,
    dealScore: 0,
    
    // Status flags
    isGoodDeal: false,
    roiStatus: { text: '—', color: '#9ca3af' },
    maoStatus: { text: '—', color: '#9ca3af' },
    dscrStatus: { text: '—', color: '#9ca3af' },
    dealScoreStatus: { text: '—', color: '#9ca3af', bg: 'bg-gray-100' }
  });

  // Real-time calculations
  useEffect(() => {
    if (formData.askingPrice && formData.arv && formData.repairs) {
      calculateAll();
    }
  }, [formData, parameterScores]);

  const calculateAll = () => {
    const asking = Number(formData.askingPrice) || 0;
    const arv = Number(formData.arv) || 0;
    const repairs = Number(formData.repairs) || 0;
    const monthlyRent = Number(formData.monthlyRent) || 0;
    const desiredProfit = Number(formData.desiredProfit) || 40000;
    
    // ========== ROI CALCULATION ==========
    const closingCosts = asking * 0.01; // 1% closing costs
    const holdingCosts = 8400; // 6 months holding
    const totalInvestment = asking + repairs + closingCosts + holdingCosts;
    
    const loanAmount = asking * 0.9; // 90% LTV
    const pointsCost = loanAmount * (2 / 100); // 2 points
    const monthlyInterest = (loanAmount * (10.5 / 100)) / 12; // 10.5% rate
    const totalFinancingCost = pointsCost + (monthlyInterest * 6); // 6 month hold
    const totalEquity = totalInvestment - loanAmount + pointsCost;
    
    const grossProfit = arv - totalInvestment - totalFinancingCost;
    const roi = totalEquity > 0 ? (grossProfit / totalEquity) * 100 : 0;
    
    // ROI Status
    const roiStatus = roi >= 30 ? { text: 'Excellent', color: '#10b981' } :
                      roi >= 20 ? { text: 'Good', color: '#3b82f6' } :
                      roi >= 10 ? { text: 'Fair', color: '#f59e0b' } :
                      { text: 'Poor', color: '#ef4444' };
    
    // ========== MAO CALCULATION ==========
    const mao = arv - repairs - desiredProfit;
    const maoStatus = asking <= mao ? 
      { text: 'Below MAO ✓', color: '#10b981' } : 
      { text: `${((asking - mao) / mao * 100).toFixed(0)}% Over`, color: '#ef4444' };
    
    // ========== DSCR CALCULATION ==========
    let dscr = 0;
    let dscrStatus = { text: 'N/A', color: '#9ca3af' };
    
    if (monthlyRent > 0) {
      const grossRentalIncome = monthlyRent * 12;
      const vacancyLoss = grossRentalIncome * 0.05; // 5% vacancy
      const effectiveGrossIncome = grossRentalIncome - vacancyLoss;
      
      const annualTaxes = 4200; // Estimated property taxes
      const annualInsurance = 1800; // Estimated insurance
      const annualMgmtFees = effectiveGrossIncome * 0.08; // 8% management
      const operatingExpenses = annualTaxes + annualInsurance + annualMgmtFees;
      
      const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
      const annualDebtService = monthlyInterest * 12;
      
      dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0;
      
      dscrStatus = dscr >= 1.25 ? { text: 'Excellent', color: '#10b981' } :
                   dscr >= 1.15 ? { text: 'Good', color: '#3b82f6' } :
                   dscr >= 1.0 ? { text: 'Barely Covers', color: '#f59e0b' } :
                   { text: 'Negative Cash Flow', color: '#ef4444' };
    }
    
    // ========== DEAL SCORE CALCULATION ==========
    const weightedLocation = parameterScores.location * (weights.location / 100);
    const weightedCondition = parameterScores.condition * (weights.condition / 100);
    const weightedMarket = parameterScores.market * (weights.market / 100);
    const weightedNumbers = parameterScores.numbers * (weights.numbers / 100);
    const weightedExit = parameterScores.exit * (weights.exit / 100);
    
    const dealScore = Math.round(
      weightedLocation + weightedCondition + weightedMarket + weightedNumbers + weightedExit
    );
    
    const dealScoreStatus = dealScore >= 90 ? { text: 'HOT DEAL! 🔥', color: '#10b981', bg: 'bg-green-100' } :
                            dealScore >= 75 ? { text: 'Strong Deal', color: '#3b82f6', bg: 'bg-blue-100' } :
                            dealScore >= 60 ? { text: 'Investigate', color: '#f59e0b', bg: 'bg-yellow-100' } :
                            { text: 'Pass', color: '#ef4444', bg: 'bg-red-100' };
    
    // Overall good deal flag
    const isGoodDeal = roi >= 15 && asking <= mao && dealScore >= 60;
    
    setCalculations({
      totalInvestment,
      totalCashInvested: totalInvestment,
      loanAmount,
      pointsCost,
      monthlyInterest,
      totalFinancingCost,
      totalEquity,
      grossProfit,
      roi,
      mao,
      dscr,
      weightedLocation,
      weightedCondition,
      weightedMarket,
      weightedNumbers,
      weightedExit,
      dealScore,
      isGoodDeal,
      roiStatus,
      maoStatus,
      dscrStatus,
      dealScoreStatus
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScoreChange = (param, value) => {
    setParameterScores({ ...parameterScores, [param]: Number(value) });
  };

  // Save to pipeline
  const handleSaveToPipeline = () => {
    alert('✅ Property saved to pipeline!');
    onClose();
    router.push('/dashboard/pipeline');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧮</span>
            <h2 className="text-xl font-bold">Quick Deal Calculator</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-500 mb-6">
          Enter property details for instant analysis of ROI, MAO, DSCR, and Deal Score
        </p>

        {/* Formula Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FormulaExplainer 
            title="ROI" 
            formula="Profit ÷ Total Cash Invested × 100"
            value={formData.askingPrice && formData.arv && formData.repairs ? `${calculations.roi.toFixed(1)}%` : '—'}
            status={calculations.roiStatus.text}
            color={calculations.roiStatus.color}
            example="$36,300 ÷ $120,700 × 100 = 30.1%"
          />
          <FormulaExplainer 
            title="MAO" 
            formula="ARV − Repairs − Desired Profit"
            value={formData.askingPrice && formData.arv && formData.repairs ? `$${calculations.mao.toLocaleString()}` : '—'}
            status={calculations.maoStatus.text}
            color={calculations.maoStatus.color}
            example="$425,000 − $45,000 − $40,000 = $340,000"
          />
          <FormulaExplainer 
            title="DSCR" 
            formula="NOI ÷ Debt Service"
            value={formData.monthlyRent ? calculations.dscr.toFixed(2) : '—'}
            status={calculations.dscrStatus.text}
            color={calculations.dscrStatus.color}
            example="$20,880 ÷ $19,704 = 1.06"
          />
          <FormulaExplainer 
            title="Deal Score" 
            formula="∑(Parameter Score × Weight)"
            value={formData.askingPrice && formData.arv && formData.repairs ? `${calculations.dealScore}/100` : '—'}
            status={calculations.dealScoreStatus.text}
            color={calculations.dealScoreStatus.color}
            example="85/100 = INVESTIGATE"
          />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Input Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Property Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Austin"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="TX">TX</option>
                  <option value="CA">CA</option>
                  <option value="FL">FL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ZIP</label>
                <input
                  type="text"
                  placeholder="78701"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Financial Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Asking Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.askingPrice}
                      onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                      placeholder="275000"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    ARV <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.arv}
                      onChange={(e) => handleInputChange('arv', e.target.value)}
                      placeholder="425000"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Repairs <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.repairs}
                      onChange={(e) => handleInputChange('repairs', e.target.value)}
                      placeholder="45000"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Monthly Rent (for DSCR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      placeholder="2800"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Desired Profit (for MAO)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.desiredProfit}
                      onChange={(e) => handleInputChange('desiredProfit', e.target.value)}
                      placeholder="40000"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Deal Score Parameters</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Location (30%)</span>
                    <span className="font-medium">{parameterScores.location}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameterScores.location}
                    onChange={(e) => handleScoreChange('location', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Condition (20%)</span>
                    <span className="font-medium">{parameterScores.condition}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameterScores.condition}
                    onChange={(e) => handleScoreChange('condition', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Market (25%)</span>
                    <span className="font-medium">{parameterScores.market}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameterScores.market}
                    onChange={(e) => handleScoreChange('market', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Numbers (15%)</span>
                    <span className="font-medium">{parameterScores.numbers}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameterScores.numbers}
                    onChange={(e) => handleScoreChange('numbers', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Exit Strategy (10%)</span>
                    <span className="font-medium">{parameterScores.exit}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameterScores.exit}
                    onChange={(e) => handleScoreChange('exit', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Instant Analysis</h3>
            
            {formData.askingPrice && formData.arv && formData.repairs ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className={`p-4 rounded-lg text-center ${
                  calculations.isGoodDeal ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <span className={`text-lg font-bold ${
                    calculations.isGoodDeal ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {calculations.isGoodDeal ? '✅ PROMISING DEAL' : '⚠️ PROCEED WITH CAUTION'}
                  </span>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Gross Profit</p>
                    <p className={`text-lg font-bold ${calculations.grossProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${calculations.grossProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Cash Needed</p>
                    <p className="text-lg font-bold text-blue-600">
                      ${calculations.totalEquity.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">70% Rule Max</p>
                    <p className="text-lg font-bold text-purple-600">
                      ${((Number(formData.arv) * 0.7) - Number(formData.repairs)).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Monthly Payment</p>
                    <p className="text-lg font-bold text-orange-600">
                      ${Math.round(calculations.monthlyInterest).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 70% Rule Check */}
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">70% Rule:</span>
                    <span className={`font-medium ${
                      (Number(formData.askingPrice) + Number(formData.repairs)) < (Number(formData.arv) * 0.7) 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(Number(formData.askingPrice) + Number(formData.repairs)) < (Number(formData.arv) * 0.7) 
                        ? '✅ Passes' : '❌ Fails'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={handleSaveToPipeline}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    📥 Save to Pipeline
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-center text-gray-400">
                <div>
                  <p className="text-6xl mb-4">📝</p>
                  <p className="text-sm">Enter asking price, ARV,</p>
                  <p className="text-sm">and repairs to see full analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}