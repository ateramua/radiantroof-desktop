import React, { useState, useEffect } from "react";
import { updateProperty } from "../../lib/api";

export default function AnalysisStep({ propertyId, updateMetrics }) {
  // Core financial inputs
  const [financials, setFinancials] = useState({
    arv: 425000,
    repairCosts: 45000,
    purchasePrice: 325000,
    monthlyRent: 2800,
    propertyTaxes: 4200,
    insurance: 1800,
    propertyManagement: 280,
    vacancyRate: 5,
    repairsReserve: 140,
    interestRate: 6.25,
    loanTerm: 30,
    downPayment: 20
  });

  // Holding costs (from original)
  const [holdingCosts, setHoldingCosts] = useState({
    taxes: 500,
    insurance: 1200,
    utilities: 300,
    interest: 2000,
    months: 6
  });

  // Calculated metrics
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    totalInvestment: 0,
    projectedProfit: 0,
    maxAllowableOffer: 0,
    cashOnCash: 0,
    capRate: 0,
    grossRentMultiplier: 0,
    monthlyMortgage: 0,
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    roi: 0,
    irr: 0,
    breakEvenPoint: 0,
    debtServiceCoverage: 0
  });

  const [dealScore, setDealScore] = useState(0);
  const [verdict, setVerdict] = useState("PENDING");
  const [reasoning, setReasoning] = useState("");

  // Calculate all metrics whenever inputs change
  useEffect(() => {
    calculateAllMetrics();
  }, [financials, holdingCosts]);

  const calculateAllMetrics = () => {
    // Basic calculations
    const totalInvestment = financials.purchasePrice + financials.repairCosts;
    const projectedProfit = financials.arv - totalInvestment;
    
    // MAO (Maximum Allowable Offer) = ARV - Repairs - Desired Profit
    const desiredProfit = 30000; // Configurable
    const maxAllowableOffer = financials.arv - financials.repairCosts - desiredProfit;
    
    // Monthly mortgage payment
    const loanAmount = financials.purchasePrice * (1 - financials.downPayment / 100);
    const monthlyRate = financials.interestRate / 100 / 12;
    const numPayments = financials.loanTerm * 12;
    const monthlyMortgage = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1) || 0;
    
    // Monthly expenses
    const monthlyTaxes = financials.propertyTaxes / 12;
    const monthlyInsurance = financials.insurance / 12;
    const monthlyVacancy = (financials.monthlyRent * financials.vacancyRate) / 100;
    const monthlyRepairs = financials.repairsReserve;
    
    // Monthly cash flow
    const monthlyExpenses = monthlyMortgage + monthlyTaxes + monthlyInsurance + 
                           financials.propertyManagement + monthlyVacancy + monthlyRepairs;
    const monthlyCashFlow = financials.monthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    
    // ROI calculations
    const totalCashInvested = financials.purchasePrice * (financials.downPayment / 100);
    const roi = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
    
    // Cap Rate (Net Operating Income / Purchase Price)
    const noi = (financials.monthlyRent * 12) - (annualCashFlow - monthlyMortgage * 12);
    const capRate = financials.purchasePrice > 0 ? (noi / financials.purchasePrice) * 100 : 0;
    
    // Gross Rent Multiplier
    const grm = financials.monthlyRent > 0 ? financials.purchasePrice / (financials.monthlyRent * 12) : 0;
    
    // Debt Service Coverage Ratio
    const dscr = monthlyMortgage > 0 ? (financials.monthlyRent - monthlyExpenses + monthlyMortgage) / monthlyMortgage : 0;
    
    // Break-even point (months to recover down payment)
    const breakEvenPoint = monthlyCashFlow > 0 ? totalCashInvested / monthlyCashFlow : 999;
    
    // Simple IRR approximation (for demo purposes)
    const irr = roi * 0.8; // Simplified

    setCalculatedMetrics({
      totalInvestment,
      projectedProfit,
      maxAllowableOffer,
      cashOnCash: roi,
      capRate,
      grossRentMultiplier: grm,
      monthlyMortgage,
      monthlyCashFlow,
      annualCashFlow,
      roi,
      irr,
      breakEvenPoint,
      debtServiceCoverage: dscr
    });

    // Calculate deal score (0-100)
    calculateDealScore({
      roi,
      capRate,
      monthlyCashFlow,
      projectedProfit,
      dscr
    });

    // Update sidebar
    if (updateMetrics) {
      updateMetrics({
        mao: maxAllowableOffer,
        projectedProfit,
        cashOnCash: roi,
        capRate,
        dealScore
      });
    }
  };

  const calculateDealScore = (metrics) => {
    let score = 0;
    const reasons = [];

    // ROI Score (0-30 points)
    if (metrics.roi >= 15) {
      score += 30;
      reasons.push("Excellent ROI");
    } else if (metrics.roi >= 10) {
      score += 20;
      reasons.push("Good ROI");
    } else if (metrics.roi >= 8) {
      score += 10;
      reasons.push("Acceptable ROI");
    } else {
      reasons.push("Low ROI");
    }

    // Cap Rate Score (0-25 points)
    if (metrics.capRate >= 8) {
      score += 25;
      reasons.push("Strong cap rate");
    } else if (metrics.capRate >= 6) {
      score += 15;
      reasons.push("Average cap rate");
    } else {
      reasons.push("Below average cap rate");
    }

    // Cash Flow Score (0-25 points)
    if (metrics.monthlyCashFlow >= 500) {
      score += 25;
      reasons.push("Excellent cash flow");
    } else if (metrics.monthlyCashFlow >= 200) {
      score += 15;
      reasons.push("Positive cash flow");
    } else if (metrics.monthlyCashFlow > 0) {
      score += 5;
      reasons.push("Breakeven cash flow");
    } else {
      reasons.push("Negative cash flow");
    }

    // Profit Score (0-20 points)
    if (metrics.projectedProfit >= 50000) {
      score += 20;
      reasons.push("High profit potential");
    } else if (metrics.projectedProfit >= 30000) {
      score += 10;
      reasons.push("Moderate profit");
    } else if (metrics.projectedProfit > 0) {
      score += 5;
      reasons.push("Low profit");
    } else {
      reasons.push("No profit");
    }

    // DSCR Score (bonus 10 points)
    if (metrics.dscr >= 1.25) {
      score += 10;
      reasons.push("Strong debt coverage");
    } else if (metrics.dscr >= 1) {
      score += 5;
      reasons.push("Adequate debt coverage");
    }

    setDealScore(Math.min(100, Math.round(score)));

    // Determine verdict
    if (score >= 80) {
      setVerdict("STRONG BUY");
      setReasoning("Excellent metrics across all categories");
    } else if (score >= 60) {
      setVerdict("BUY");
      setReasoning("Good fundamentals, meets investment criteria");
    } else if (score >= 40) {
      setVerdict("MAYBE");
      setReasoning("Further due diligence required");
    } else if (score >= 20) {
      setVerdict("PASS");
      setReasoning("Does not meet minimum criteria");
    } else {
      setVerdict("REJECT");
      setReasoning("Significant red flags");
    }
  };

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    setFinancials({ ...financials, [name]: Number(value) });
  };

  const handleHoldingCostChange = (e) => {
    const { name, value } = e.target;
    setHoldingCosts({ ...holdingCosts, [name]: Number(value) });
  };

  const handleSave = async () => {
    try {
      // Structured analysis data matching the desired JSON format
      const analysisData = {
        // Critical numbers
        arv: financials.arv,
        repairCosts: financials.repairCosts,
        purchasePrice: financials.purchasePrice,
        totalInvestment: calculatedMetrics.totalInvestment,
        projectedProfit: calculatedMetrics.projectedProfit,
        
        // Decision metrics
        maxAllowableOffer: calculatedMetrics.maxAllowableOffer,
        offerPrice: financials.purchasePrice, // Could be separate field
        cashOnCashReturn: Number(calculatedMetrics.cashOnCash.toFixed(1)),
        capRate: Number(calculatedMetrics.capRate.toFixed(1)),
        grossRentMultiplier: Number(calculatedMetrics.grossRentMultiplier.toFixed(1)),
        
        // Detailed financials
        monthlyCashFlow: calculatedMetrics.monthlyCashFlow,
        annualCashFlow: calculatedMetrics.annualCashFlow,
        roi: Number(calculatedMetrics.roi.toFixed(1)),
        irr: Number(calculatedMetrics.irr.toFixed(1)),
        debtServiceCoverage: Number(calculatedMetrics.debtServiceCoverage.toFixed(2)),
        breakEvenMonths: Math.round(calculatedMetrics.breakEvenPoint),
        
        // Automated decision
        dealScore: dealScore,
        verdict: verdict,
        reasoning: reasoning,
        
        // Raw inputs for reference
        inputs: {
          financials,
          holdingCosts
        }
      };

      await updateProperty(propertyId, { analysis: analysisData });
      
      // Show verdict-based message
      const messages = {
        "STRONG BUY": "🎯 STRONG BUY - Excellent investment opportunity!",
        "BUY": "✅ BUY - Meets all investment criteria",
        "MAYBE": "⚠️ MAYBE - Consider further due diligence",
        "PASS": "⛔ PASS - Does not meet minimum requirements",
        "REJECT": "🚫 REJECT - Significant red flags"
      };
      
      alert(messages[verdict] || "Analysis data saved successfully!");
      
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  // Get color based on verdict
  const getVerdictColor = () => {
    const colors = {
      "STRONG BUY": "text-green-600 bg-green-50 border-green-200",
      "BUY": "text-blue-600 bg-blue-50 border-blue-200",
      "MAYBE": "text-yellow-600 bg-yellow-50 border-yellow-200",
      "PASS": "text-orange-600 bg-orange-50 border-orange-200",
      "REJECT": "text-red-600 bg-red-50 border-red-200"
    };
    return colors[verdict] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Financial Analysis</h3>
      
      {/* Deal Score Dashboard */}
      <div className={`p-4 rounded-lg border ${getVerdictColor()}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Deal Score:</span>
          <span className="text-2xl font-bold">{dealScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full ${
              dealScore >= 80 ? 'bg-green-600' :
              dealScore >= 60 ? 'bg-blue-600' :
              dealScore >= 40 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${dealScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{verdict}</span>
          <span className="text-sm">{reasoning}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 p-3 rounded text-center">
          <div className="text-xs text-blue-600">MAO</div>
          <div className="text-lg font-bold text-blue-700">
            ${calculatedMetrics.maxAllowableOffer.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <div className="text-xs text-green-600">Profit</div>
          <div className="text-lg font-bold text-green-700">
            ${calculatedMetrics.projectedProfit.toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded text-center">
          <div className="text-xs text-purple-600">ROI</div>
          <div className="text-lg font-bold text-purple-700">
            {calculatedMetrics.roi.toFixed(1)}%
          </div>
        </div>
        <div className="bg-indigo-50 p-3 rounded text-center">
          <div className="text-xs text-indigo-600">Cash-on-Cash</div>
          <div className="text-lg font-bold text-indigo-700">
            {calculatedMetrics.cashOnCash.toFixed(1)}%
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded text-center">
          <div className="text-xs text-yellow-600">Cap Rate</div>
          <div className="text-lg font-bold text-yellow-700">
            {calculatedMetrics.capRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-pink-50 p-3 rounded text-center">
          <div className="text-xs text-pink-600">Cash Flow</div>
          <div className="text-lg font-bold text-pink-700">
            ${Math.round(calculatedMetrics.monthlyCashFlow)}/mo
          </div>
        </div>
      </div>

      {/* Financial Inputs Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Property Financials</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">ARV ($)</label>
            <input
              type="number"
              name="arv"
              value={financials.arv}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Repair Costs ($)</label>
            <input
              type="number"
              name="repairCosts"
              value={financials.repairCosts}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Purchase Price ($)</label>
            <input
              type="number"
              name="purchasePrice"
              value={financials.purchasePrice}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Monthly Rent ($)</label>
            <input
              type="number"
              name="monthlyRent"
              value={financials.monthlyRent}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Property Taxes (annual)</label>
            <input
              type="number"
              name="propertyTaxes"
              value={financials.propertyTaxes}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Insurance (annual)</label>
            <input
              type="number"
              name="insurance"
              value={financials.insurance}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Property Mgmt ($/mo)</label>
            <input
              type="number"
              name="propertyManagement"
              value={financials.propertyManagement}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Vacancy Rate (%)</label>
            <input
              type="number"
              name="vacancyRate"
              value={financials.vacancyRate}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
              step="0.1"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Repairs Reserve ($/mo)</label>
            <input
              type="number"
              name="repairsReserve"
              value={financials.repairsReserve}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* Financing Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Financing Details</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={financials.interestRate}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
              step="0.125"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Loan Term (years)</label>
            <input
              type="number"
              name="loanTerm"
              value={financials.loanTerm}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Down Payment (%)</label>
            <input
              type="number"
              name="downPayment"
              value={financials.downPayment}
              onChange={handleFinancialChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <p className="text-sm">Estimated Monthly Mortgage: ${Math.round(calculatedMetrics.monthlyMortgage).toLocaleString()}</p>
        </div>
      </div>

      {/* Holding Costs Section (Original) */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Holding Costs (Pre-Acquisition)</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(holdingCosts).map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium capitalize">{field}</label>
              <input
                type="number"
                name={field}
                value={holdingCosts[field]}
                onChange={handleHoldingCostChange}
                className="border p-2 rounded w-full"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics Summary */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Detailed Analysis</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Total Investment:</span>
            <span className="font-medium">${calculatedMetrics.totalInvestment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Monthly Cash Flow:</span>
            <span className="font-medium">${Math.round(calculatedMetrics.monthlyCashFlow).toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Annual Cash Flow:</span>
            <span className="font-medium">${Math.round(calculatedMetrics.annualCashFlow).toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>IRR (est.):</span>
            <span className="font-medium">{calculatedMetrics.irr.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>DSCR:</span>
            <span className="font-medium">{calculatedMetrics.debtServiceCoverage.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Break-even (months):</span>
            <span className="font-medium">{Math.round(calculatedMetrics.breakEvenPoint)}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
      >
        Save Analysis & Get Decision
      </button>
    </div>
  );
}