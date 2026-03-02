"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Enhanced Formula Explainer with glass morphism
const FormulaExplainer = ({ title, formula, value, status, color, example }) => (
  <div className="group relative backdrop-blur-xl bg-white/80 rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {title.charAt(0)}
        </div>
      </div>
      
      <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent" 
         style={{ color: color }}>
        {value}
      </p>
      
      <p className="text-xs text-gray-500 font-mono bg-gray-50/50 p-2 rounded-lg mb-2">{formula}</p>
      
      {status && (
        <span className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${
          status === 'Excellent' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
          status === 'Good' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
          status === 'Investigate' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
          'bg-gradient-to-r from-red-500 to-rose-500 text-white'
        }`}>
          {status}
        </span>
      )}
      
      <p className="text-xs text-gray-400 mt-3 italic border-t border-gray-100 pt-2">ex: {example}</p>
    </div>
  </div>
);

// Animated input with floating label
const AnimatedInput = ({ label, value, onChange, placeholder, type = "text", required = false, icon = "$" }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <label className={`absolute left-3 transition-all duration-200 ${
        isFocused || value ? '-top-6 text-sm text-blue-600 font-medium' : 'top-2 text-gray-400'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-3 text-gray-400 font-medium">{icon}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? '' : placeholder}
          className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 pl-8 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};

// Stylish range slider
const StylishSlider = ({ label, value, onChange, min, max, weight }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">({weight})</span>
        <span className="text-lg font-bold text-blue-600">{value}</span>
      </div>
    </div>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  </div>
);

// Glass card component
const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl ${className}`}>
    {children}
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
    totalInvestment: 0,
    totalCashInvested: 0,
    loanAmount: 0,
    pointsCost: 0,
    monthlyInterest: 0,
    totalFinancingCost: 0,
    totalEquity: 0,
    grossProfit: 0,
    roi: 0,
    mao: 0,
    dscr: 0,
    dealScore: 0,
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
    const closingCosts = asking * 0.01;
    const holdingCosts = 8400;
    const totalInvestment = asking + repairs + closingCosts + holdingCosts;
    
    const loanAmount = asking * 0.9;
    const pointsCost = loanAmount * (2 / 100);
    const monthlyInterest = (loanAmount * (10.5 / 100)) / 12;
    const totalFinancingCost = pointsCost + (monthlyInterest * 6);
    const totalEquity = totalInvestment - loanAmount + pointsCost;
    
    const grossProfit = arv - totalInvestment - totalFinancingCost;
    const roi = totalEquity > 0 ? (grossProfit / totalEquity) * 100 : 0;
    
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
      const vacancyLoss = grossRentalIncome * 0.05;
      const effectiveGrossIncome = grossRentalIncome - vacancyLoss;
      
      const annualTaxes = 4200;
      const annualInsurance = 1800;
      const annualMgmtFees = effectiveGrossIncome * 0.08;
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

  const handleSaveToPipeline = () => {
    alert('✅ Property saved to pipeline!');
    onClose();
    router.push('/dashboard/pipeline');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative max-w-6xl w-full max-h-[90vh] mx-4 animate-slideUp">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-500 to-teal-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        {/* Main modal content */}
        <GlassCard className="p-8 overflow-y-auto max-h-[90vh] relative">
          {/* Header with gradient */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg animate-float">
                <span className="text-2xl">🧮</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Quick Deal Calculator
                </h2>
                <p className="text-sm text-gray-500">Instant analysis powered by AI</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <span className="text-gray-500 text-xl">✕</span>
            </button>
          </div>

          {/* Formula Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Input Form */}
            <div className="space-y-6">
              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">1</span>
                  Property Details
                </h3>
                
                <div className="space-y-4">
                  <AnimatedInput
                    label="Street Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St"
                    icon="📍"
                    type="text"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <AnimatedInput
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Austin"
                      icon="🌆"
                    />
                    
                    <div className="relative">
                      <label className="text-sm text-gray-600 mb-1 block">State</label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50 backdrop-blur-sm"
                      >
                        <option value="TX">TX</option>
                        <option value="CA">CA</option>
                        <option value="FL">FL</option>
                        <option value="NY">NY</option>
                        <option value="CO">CO</option>
                      </select>
                    </div>
                    
                    <AnimatedInput
                      label="ZIP"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      placeholder="78701"
                      icon="📮"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">2</span>
                  Financial Details
                </h3>
                
                <div className="space-y-4">
                  <AnimatedInput
                    label="Asking Price"
                    value={formData.askingPrice}
                    onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                    placeholder="275000"
                    required={true}
                    icon="$"
                    type="number"
                  />
                  
                  <AnimatedInput
                    label="After Repair Value (ARV)"
                    value={formData.arv}
                    onChange={(e) => handleInputChange('arv', e.target.value)}
                    placeholder="425000"
                    required={true}
                    icon="$"
                    type="number"
                  />
                  
                  <AnimatedInput
                    label="Estimated Repairs"
                    value={formData.repairs}
                    onChange={(e) => handleInputChange('repairs', e.target.value)}
                    placeholder="45000"
                    required={true}
                    icon="$"
                    type="number"
                  />
                  
                  <AnimatedInput
                    label="Monthly Rent (for DSCR)"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    placeholder="2800"
                    icon="$"
                    type="number"
                  />
                  
                  <AnimatedInput
                    label="Desired Profit (for MAO)"
                    value={formData.desiredProfit}
                    onChange={(e) => handleInputChange('desiredProfit', e.target.value)}
                    placeholder="40000"
                    icon="$"
                    type="number"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Results & Scoring */}
            <div className="space-y-6">
              {/* Live Results Dashboard */}
              <GlassCard className="p-6 bg-gradient-to-br from-blue-600/5 to-purple-600/5">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">⚡</span>
                  Live Results
                </h3>
                
                {formData.askingPrice && formData.arv && formData.repairs ? (
                  <div className="space-y-4">
                    {/* Main metric cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Gross Profit</p>
                        <p className={`text-2xl font-bold ${calculations.grossProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${calculations.grossProfit.toLocaleString()}
                        </p>
                        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                          <div className={`h-full ${calculations.grossProfit > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                               style={{ width: `${Math.min(100, (calculations.grossProfit / 100000) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Cash Needed</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${calculations.totalEquity.toLocaleString()}
                        </p>
                        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (calculations.totalEquity / 200000) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={`p-4 rounded-xl text-center transform transition-all duration-500 ${
                      calculations.isGoodDeal ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                    }`}>
                      <span className="text-lg font-bold text-white drop-shadow-md">
                        {calculations.isGoodDeal ? '✅ PROMISING DEAL' : '⚠️ PROCEED WITH CAUTION'}
                      </span>
                    </div>

                    {/* 70% Rule */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">70% Rule Check</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (Number(formData.askingPrice) + Number(formData.repairs)) < (Number(formData.arv) * 0.7) 
                            ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {(Number(formData.askingPrice) + Number(formData.repairs)) < (Number(formData.arv) * 0.7) 
                            ? '✓ Passes' : '✗ Fails'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Max Safe Offer: ${((Number(formData.arv) * 0.7) - Number(formData.repairs)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 bg-white/30 backdrop-blur-sm rounded-xl">
                    <div className="text-7xl mb-4 animate-bounce">📊</div>
                    <p className="text-lg font-medium">Waiting for numbers...</p>
                    <p className="text-sm mt-2">Enter asking price, ARV, and repairs</p>
                  </div>
                )}
              </GlassCard>

              {/* Deal Score Parameters */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">3</span>
                  Deal Score Parameters
                </h3>
                
                <div className="space-y-4">
                  <StylishSlider
                    label="Location"
                    value={parameterScores.location}
                    onChange={(e) => handleScoreChange('location', e.target.value)}
                    min="0"
                    max="100"
                    weight="30%"
                  />
                  
                  <StylishSlider
                    label="Condition"
                    value={parameterScores.condition}
                    onChange={(e) => handleScoreChange('condition', e.target.value)}
                    min="0"
                    max="100"
                    weight="20%"
                  />
                  
                  <StylishSlider
                    label="Market"
                    value={parameterScores.market}
                    onChange={(e) => handleScoreChange('market', e.target.value)}
                    min="0"
                    max="100"
                    weight="25%"
                  />
                  
                  <StylishSlider
                    label="Numbers"
                    value={parameterScores.numbers}
                    onChange={(e) => handleScoreChange('numbers', e.target.value)}
                    min="0"
                    max="100"
                    weight="15%"
                  />
                  
                  <StylishSlider
                    label="Exit Strategy"
                    value={parameterScores.exit}
                    onChange={(e) => handleScoreChange('exit', e.target.value)}
                    min="0"
                    max="100"
                    weight="10%"
                  />
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveToPipeline}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  📥 Save to Pipeline
                </button>
                <button
                  onClick={onClose}
                  className="px-6 bg-white/80 backdrop-blur-sm border-2 border-gray-200 py-4 rounded-xl font-semibold hover:bg-white hover:border-gray-300 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}