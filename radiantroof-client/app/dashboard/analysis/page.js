"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

// Formula Explainer Component (keeping existing)
const FormulaExplainer = ({ title, formula, value, status, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
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
  </div>
);

// Parameter Score Component (keeping existing)
const ParameterScore = ({ label, value, weight, score, onChange }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">
        <span className="text-blue-600 font-bold">{value}</span>
        <span className="text-gray-400 mx-1">×</span>
        <span className="text-purple-600">{weight}%</span>
        <span className="text-gray-400 mx-1">=</span>
        <span className="text-green-600 font-bold">{score}</span>
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
    <div className="flex justify-between text-xs text-gray-400">
      <span>Poor (0)</span>
      <span>Average (50)</span>
      <span>Excellent (100)</span>
    </div>
  </div>
);

// NEW: Detailed Repair Summary Component
const DetailedRepairSummary = ({ repairData }) => {
  if (!repairData) return null;

  const majorSystemsTotal = Object.values(repairData.majorSystems || {}).reduce((sum, item) => sum + item.cost, 0);
  const roomsTotal = Object.values(repairData.rooms || {}).reduce((sum, item) => sum + item.cost, 0);
  const quickEstimate = majorSystemsTotal + roomsTotal;
  const finalBudget = quickEstimate * (1 + (repairData.contingencyPercent || 15) / 100);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">🔨 Detailed Repair Breakdown</h3>
      
      <div className="space-y-3">
        {/* Major Systems */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Major Systems</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(repairData.majorSystems || {}).map(([system, data]) => (
              data.cost > 0 && (
                <div key={system} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-500">{system}:</span>
                  <span className="font-medium">${data.cost.toLocaleString()}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Room Finishes */}
        <div className="border-t pt-2">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Room Finishes</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(repairData.rooms || {}).map(([room, data]) => (
              data.cost > 0 && (
                <div key={room} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-500">{room.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-medium">${data.cost.toLocaleString()}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-3 mt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Quick Estimate:</span>
            <span className="font-medium">${quickEstimate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Contingency ({repairData.contingencyPercent || 15}%):</span>
            <span className="font-medium">${(finalBudget - quickEstimate).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold mt-2">
            <span>Final Repair Budget:</span>
            <span className="text-blue-600">${finalBudget.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalysisPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Property Details
  const [purchasePrice, setPurchasePrice] = useState(275000);
  const [arv, setArv] = useState(425000);
  
  // NEW: Replace simple repairCosts with detailed repair data
  const [repairData, setRepairData] = useState({
    majorSystems: {
      roof: { condition: "Fair", cost: 8000 },
      hvac: { condition: "Good", cost: 0 },
      electrical: { condition: "Poor", cost: 12000 },
      plumbing: { condition: "Good", cost: 0 },
      foundation: { condition: "Good", cost: 0 }
    },
    rooms: {
      kitchen: { condition: "Full Gut", cost: 25000 },
      bathroom1: { condition: "Full Gut", cost: 12000 },
      bathroom2: { condition: "Cosmetic", cost: 5000 },
      bedrooms: { condition: "Paint/Flooring", cost: 8000 },
      living: { condition: "Paint/Flooring", cost: 4000 },
      basement: { condition: "Waterproofing", cost: 6000 }
    },
    contingencyPercent: 15
  });

  // Calculate total repair costs from detailed data
  const calculateRepairTotal = () => {
    const majorSystemsTotal = Object.values(repairData.majorSystems).reduce((sum, item) => sum + item.cost, 0);
    const roomsTotal = Object.values(repairData.rooms).reduce((sum, item) => sum + item.cost, 0);
    return majorSystemsTotal + roomsTotal;
  };

  const repairCosts = calculateRepairTotal();
  const repairCostsWithContingency = repairCosts * (1 + repairData.contingencyPercent / 100);

  const [holdingCosts, setHoldingCosts] = useState(8400);
  const [closingCosts, setClosingCosts] = useState(18500);
  const [financingRate, setFinancingRate] = useState(10.5);
  const [financingPoints, setFinancingPoints] = useState(2);
  
  // Rental Income (for DSCR)
  const [monthlyRent, setMonthlyRent] = useState(2800);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [propertyTaxes, setPropertyTaxes] = useState(4200);
  const [insurance, setInsurance] = useState(1800);
  const [propertyManagement, setPropertyManagement] = useState(8);
  
  // Parameter Scores (for Deal Score)
  const [locationScore, setLocationScore] = useState(85);
  const [conditionScore, setConditionScore] = useState(70);
  const [marketScore, setMarketScore] = useState(90);
  const [numbersScore, setNumbersScore] = useState(75);
  const [exitScore, setExitScore] = useState(80);
  
  // Weights for Deal Score
  const weights = {
    location: 30,
    condition: 20,
    market: 25,
    numbers: 15,
    exit: 10
  };

  // ============= REAL-TIME CALCULATIONS =============
  
  // 1. ROI Calculation
  const totalCashInvested = purchasePrice + repairCostsWithContingency + holdingCosts + closingCosts;
  const loanAmount = purchasePrice * 0.9; // 90% LTV
  const pointsCost = loanAmount * (financingPoints / 100);
  const monthlyInterest = (loanAmount * (financingRate / 100)) / 12;
  const totalFinancingCost = pointsCost + (monthlyInterest * 6); // 6 month hold
  const totalEquity = totalCashInvested - loanAmount + pointsCost;
  
  const grossProfit = arv - totalCashInvested - totalFinancingCost;
  const roi = (grossProfit / totalEquity) * 100;
  
  // ROI Status
  const getRoiStatus = () => {
    if (roi >= 30) return { text: 'Excellent', color: '#10b981' };
    if (roi >= 20) return { text: 'Good', color: '#3b82f6' };
    if (roi >= 10) return { text: 'Fair', color: '#f59e0b' };
    return { text: 'Poor', color: '#ef4444' };
  };
  
  // 2. MAO (Maximum Allowable Offer) Calculation
  const desiredProfit = 40000; // Target profit
  const mao = arv - repairCostsWithContingency - desiredProfit;
  
  // MAO Status
  const getMaoStatus = () => {
    if (purchasePrice <= mao) return { text: 'Below MAO ✓', color: '#10b981' };
    const overBy = ((purchasePrice - mao) / mao * 100).toFixed(0);
    return { text: `${overBy}% Over MAO`, color: '#ef4444' };
  };
  
  // 3. DSCR (Debt Service Coverage Ratio) Calculation
  const grossRentalIncome = monthlyRent * 12;
  const vacancyLoss = grossRentalIncome * (vacancyRate / 100);
  const effectiveGrossIncome = grossRentalIncome - vacancyLoss;
  
  const annualTaxes = propertyTaxes;
  const annualInsurance = insurance;
  const annualMgmtFees = effectiveGrossIncome * (propertyManagement / 100);
  const operatingExpenses = annualTaxes + annualInsurance + annualMgmtFees;
  
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
  
  const annualDebtService = monthlyInterest * 12;
  const dscr = netOperatingIncome / annualDebtService;
  
  // DSCR Status
  const getDscrStatus = () => {
    if (dscr >= 1.25) return { text: 'Excellent', color: '#10b981' };
    if (dscr >= 1.15) return { text: 'Good', color: '#3b82f6' };
    if (dscr >= 1.0) return { text: 'Barely Covers', color: '#f59e0b' };
    return { text: 'Negative Cash Flow', color: '#ef4444' };
  };
  
  // 4. Deal Score Calculation
  const weightedLocation = locationScore * (weights.location / 100);
  const weightedCondition = conditionScore * (weights.condition / 100);
  const weightedMarket = marketScore * (weights.market / 100);
  const weightedNumbers = numbersScore * (weights.numbers / 100);
  const weightedExit = exitScore * (weights.exit / 100);
  
  const dealScore = Math.round(
    weightedLocation + weightedCondition + weightedMarket + weightedNumbers + weightedExit
  );
  
  // Deal Score Status
  const getDealScoreStatus = () => {
    if (dealScore >= 90) return { text: 'HOT DEAL! 🔥', color: '#10b981', bg: 'bg-green-100' };
    if (dealScore >= 75) return { text: 'Strong Deal', color: '#3b82f6', bg: 'bg-blue-100' };
    if (dealScore >= 60) return { text: 'Investigate', color: '#f59e0b', bg: 'bg-yellow-100' };
    return { text: 'Pass', color: '#ef4444', bg: 'bg-red-100' };
  };

  // 5. NEW: Repair to ARV Ratio
  const repairToArvRatio = (repairCostsWithContingency / arv * 100).toFixed(1);

  // Comps data
  const comps = [
    { id: 1, address: "123 Main St", soldPrice: 425000, soldDate: "2024-01-15", sqft: 1850, pricePerSqft: 230 },
    { id: 2, address: "456 Oak Ave", soldPrice: 415000, soldDate: "2024-01-22", sqft: 1800, pricePerSqft: 231 },
    { id: 3, address: "789 Pine St", soldPrice: 435000, soldDate: "2024-02-01", sqft: 1900, pricePerSqft: 229 },
    { id: 4, address: "321 Elm St", soldPrice: 418000, soldDate: "2024-01-28", sqft: 1820, pricePerSqft: 230 },
    { id: 5, address: "654 Maple Ave", soldPrice: 430000, soldDate: "2024-02-05", sqft: 1880, pricePerSqft: 229 },
  ];

  const avgPricePerSqft = comps.reduce((acc, c) => acc + c.pricePerSqft, 0) / comps.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Deal Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time calculations update as you adjust inputs
          </p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>123 Main St</option>
            <option>456 Oak Ave</option>
            <option>789 Pine St</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Save Analysis
          </button>
        </div>
      </div>

      {/* Real-Time Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <FormulaExplainer 
          title="ROI" 
          formula="Profit ÷ Total Cash Invested × 100"
          value={`${roi.toFixed(1)}%`}
          status={getRoiStatus().text}
          color={getRoiStatus().color}
        />
        <FormulaExplainer 
          title="MAO" 
          formula="ARV − Repairs − Desired Profit"
          value={`$${mao.toLocaleString()}`}
          status={getMaoStatus().text}
          color={getMaoStatus().color}
        />
        <FormulaExplainer 
          title="DSCR" 
          formula="NOI ÷ Debt Service"
          value={dscr.toFixed(2)}
          status={getDscrStatus().text}
          color={getDscrStatus().color}
        />
        <FormulaExplainer 
          title="Deal Score" 
          formula="∑(Parameter Score × Weight)"
          value={`${dealScore}/100`}
          status={getDealScoreStatus().text}
          color={getDealScoreStatus().color}
        />
        {/* NEW: Repair Ratio Metric */}
        <FormulaExplainer 
          title="Repair/ARV" 
          formula="Repair Cost ÷ ARV"
          value={`${repairToArvRatio}%`}
          status={repairToArvRatio < 15 ? 'Excellent' : repairToArvRatio < 25 ? 'Good' : 'High'}
          color={repairToArvRatio < 15 ? '#10b981' : repairToArvRatio < 25 ? '#3b82f6' : '#f59e0b'}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "calculator"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📊 Deal Calculator
          </button>
          <button
            onClick={() => setActiveTab("repairs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "repairs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🔨 Detailed Repairs
          </button>
          <button
            onClick={() => setActiveTab("comps")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "comps"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🏘️ Comps Analysis
          </button>
          <button
            onClick={() => setActiveTab("financing")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "financing"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            💰 Financing Options
          </button>
          <button
            onClick={() => setActiveTab("scoring")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "scoring"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📈 Deal Scoring
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Inputs */}
        <div className={`${activeTab === "calculator" || activeTab === "scoring" ? "col-span-2" : "col-span-3"}`}>
          {activeTab === "calculator" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Deal Calculator</h2>
              
              {/* NEW: Show repair summary inline */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Repair Budget (from detailed assessment):</span>
                  <span className="text-xl font-bold text-blue-600">${repairCostsWithContingency.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Includes {repairData.contingencyPercent}% contingency | Base repairs: ${repairCosts.toLocaleString()}
                </p>
                <button 
                  onClick={() => setActiveTab("repairs")}
                  className="text-sm text-blue-600 hover:underline mt-2"
                >
                  View detailed breakdown →
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Purchase Price</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">ARV (After Repair Value)</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={arv}
                        onChange={(e) => setArv(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Holding Costs (6 months)</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={holdingCosts}
                        onChange={(e) => setHoldingCosts(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Closing Costs</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={closingCosts}
                        onChange={(e) => setClosingCosts(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Financing Rate (%)</label>
                    <input
                        type="number"
                        value={financingRate}
                        onChange={(e) => setFinancingRate(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Loan Points (%)</label>
                    <input
                        type="number"
                        value={financingPoints}
                        onChange={(e) => setFinancingPoints(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                  </div>
                </div>
              </div>

              {/* DSCR Inputs - moved outside the grid for better spacing */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Rental Income (for DSCR)</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Monthly Rent</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Vacancy Rate (%)</label>
                    <input
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Detailed Repairs Tab */}
          {activeTab === "repairs" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🔨 Detailed Repair Assessment</h2>
              
              <div className="space-y-6">
                {/* Major Systems */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Major Systems</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(repairData.majorSystems).map(([system, data]) => (
                      <div key={system} className="border rounded-lg p-3">
                        <label className="block text-sm font-medium text-gray-600 capitalize mb-2">
                          {system}
                        </label>
                        <select 
                          value={data.condition}
                          onChange={(e) => {
                            const condition = e.target.value;
                            const cost = condition === 'New' ? 0 :
                                        condition === 'Good' ? 0 :
                                        condition === 'Fair' ? 5000 :
                                        condition === 'Poor' ? 8000 : 12000;
                            setRepairData(prev => ({
                              ...prev,
                              majorSystems: {
                                ...prev.majorSystems,
                                [system]: { condition, cost }
                              }
                            }));
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="New">New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair (+$5k)</option>
                          <option value="Poor">Poor (+$8k)</option>
                          <option value="Replace">Replace (+$12k)</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Finishes */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Room Finishes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(repairData.rooms).map(([room, data]) => (
                      <div key={room} className="border rounded-lg p-3">
                        <label className="block text-sm font-medium text-gray-600 capitalize mb-2">
                          {room.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <select 
                          value={data.condition}
                          onChange={(e) => {
                            const condition = e.target.value;
                            const cost = condition === 'New' ? 0 :
                                        condition === 'Cosmetic' ? 5000 :
                                        condition === 'Paint/Flooring' ? 8000 :
                                        condition === 'Partial Gut' ? 15000 : 25000;
                            setRepairData(prev => ({
                              ...prev,
                              rooms: {
                                ...prev.rooms,
                                [room]: { condition, cost }
                              }
                            }));
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="New">New</option>
                          <option value="Cosmetic">Cosmetic (+$5k)</option>
                          <option value="Paint/Flooring">Paint/Flooring (+$8k)</option>
                          <option value="Partial Gut">Partial Gut (+$15k)</option>
                          <option value="Full Gut">Full Gut (+$25k)</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contingency Slider */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium">Contingency Percentage</label>
                    <span className="text-lg font-bold text-blue-600">{repairData.contingencyPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={repairData.contingencyPercent}
                    onChange={(e) => setRepairData(prev => ({ ...prev, contingencyPercent: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5% (Low Risk)</span>
                    <span>15% (Standard)</span>
                    <span>25% (High Risk)</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Base Repair Estimate</p>
                      <p className="text-2xl font-bold text-blue-600">${repairCosts.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">With Contingency</p>
                      <p className="text-2xl font-bold text-green-600">${repairCostsWithContingency.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scoring" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Deal Scoring Parameters</h2>
              <p className="text-sm text-gray-500 mb-4">Adjust each parameter to see real-time Deal Score impact</p>
              
              <ParameterScore 
                label="Location Score (30% weight)"
                value={locationScore}
                weight={weights.location}
                score={weightedLocation}
                onChange={setLocationScore}
              />
              <ParameterScore 
                label="Property Condition (20% weight)"
                value={conditionScore}
                weight={weights.condition}
                score={weightedCondition}
                onChange={setConditionScore}
              />
              <ParameterScore 
                label="Market Strength (25% weight)"
                value={marketScore}
                weight={weights.market}
                score={weightedMarket}
                onChange={setMarketScore}
              />
              <ParameterScore 
                label="Numbers Viability (15% weight)"
                value={numbersScore}
                weight={weights.numbers}
                score={weightedNumbers}
                onChange={setNumbersScore}
              />
              <ParameterScore 
                label="Exit Strategy (10% weight)"
                value={exitScore}
                weight={weights.exit}
                score={weightedExit}
                onChange={setExitScore}
              />
              
              <div className={`mt-6 p-4 rounded-lg ${getDealScoreStatus().bg}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Final Deal Score:</span>
                  <span className="text-2xl font-bold" style={{ color: getDealScoreStatus().color }}>
                    {dealScore}/100
                  </span>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Verdict:</span>{' '}
                  {dealScore >= 90 ? '🔥 HOT DEAL! Proceed immediately' :
                   dealScore >= 75 ? '✅ Strong Deal - Move forward' :
                   dealScore >= 60 ? '⚠️ Investigate further - Mitigate risks' :
                   '❌ Pass - Not worth the risk'}
                </p>
              </div>
            </div>
          )}

          {activeTab === "comps" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Comparable Properties</h2>
              
              {/* Comps Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Sold Price</p>
                  <p className="text-xl font-bold">$424,600</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Price/SqFt</p>
                  <p className="text-xl font-bold">${avgPricePerSqft.toFixed(0)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Your ARV</p>
                  <p className="text-xl font-bold">${arv.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Est. Value/SqFt</p>
                  <p className="text-xl font-bold">${(arv/1850).toFixed(0)}</p>
                </div>
              </div>

              {/* Comps Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Address</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Sold Price</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Sq Ft</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">$/SqFt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comps.map((comp) => (
                      <tr key={comp.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm">{comp.address}</td>
                        <td className="py-3 text-sm font-medium">${comp.soldPrice.toLocaleString()}</td>
                        <td className="py-3 text-sm text-gray-500">{comp.soldDate}</td>
                        <td className="py-3 text-sm">{comp.sqft}</td>
                        <td className="py-3 text-sm">${comp.pricePerSqft}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">ARV Recommendation:</span> Based on comps, your ARV of ${arv.toLocaleString()} is 
                  <span className={arv > 424600 ? "text-green-600" : "text-blue-600"}>
                    {" "}{arv > 424600 ? "above" : "below"} market average
                  </span>
                </p>
              </div>
            </div>
          )}

          {activeTab === "financing" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Financing Options</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Hard Money */}
                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="text-center mb-3">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="font-semibold text-center">Hard Money</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Rate:</span>
                      <span className="font-medium">12.5%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Points:</span>
                      <span className="font-medium">2 pts</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Monthly:</span>
                      <span className="font-medium">$4,200</span>
                    </p>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
                    Select Option
                  </button>
                </div>

                {/* Private Money */}
                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer border-green-300 bg-green-50">
                  <div className="text-center mb-3">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-center">Private Money</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Rate:</span>
                      <span className="font-medium">10%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Points:</span>
                      <span className="font-medium">0 pts</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Monthly:</span>
                      <span className="font-medium">$3,800</span>
                    </p>
                  </div>
                  <button className="w-full mt-4 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition">
                    Recommended
                  </button>
                </div>

                {/* Conventional */}
                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="text-center mb-3">
                    <span className="text-3xl">🏦</span>
                  </div>
                  <h3 className="font-semibold text-center">Conventional</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Rate:</span>
                      <span className="font-medium">7.5%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Terms:</span>
                      <span className="font-medium">30 yr fixed</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Monthly:</span>
                      <span className="font-medium">$2,400</span>
                    </p>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
                    Select Option
                  </button>
                </div>
              </div>

              {/* Private Money Matchmaker */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-3">🤝 Private Money Matchmaker</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">Michael R.</p>
                      <p className="text-xs text-gray-500">Portfolio: $1.2M • 8 deals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">$100k-$500k @ 10-12%</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sarah K.</p>
                      <p className="text-xs text-gray-500">Portfolio: $850k • 5 deals</p>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">Connect</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            {/* Profit Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Profit Analysis</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-500">ARV</span>
                  <span className="font-semibold text-green-600">${arv.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Purchase Price</span>
                  <span className="font-medium">${purchasePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Repair Costs (with contingency)</span>
                  <span className="font-medium text-orange-600">-${repairCostsWithContingency.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Holding + Closing</span>
                  <span className="font-medium text-orange-600">-${(holdingCosts + closingCosts).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Financing Costs</span>
                  <span className="font-medium text-orange-600">-${totalFinancingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Estimated Profit</span>
                  <span className={`text-xl font-bold ${grossProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${grossProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className={`text-lg font-bold ${roi > 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {roi.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Cash Needed</p>
                  <p className="text-lg font-bold text-blue-600">${totalEquity.toLocaleString()}</p>
                </div>
              </div>

              {/* 70% Rule Check */}
              <div className={`mt-4 p-3 rounded-lg ${(purchasePrice + repairCostsWithContingency) < (arv * 0.7) ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <p className="text-sm">
                  <span className="font-semibold">70% Rule: </span>
                  {(purchasePrice + repairCostsWithContingency) < (arv * 0.7) 
                    ? '✅ Passes (within 70% rule)' 
                    : '⚠️ Exceeds 70% rule'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  📊 Generate Full Report
                </button>
                <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                  💬 Contact Seller
                </button>
                <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                  📝 Make Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}