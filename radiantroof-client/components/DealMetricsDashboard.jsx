'use client';
// lib/dealCalculations.js

// Calculate deal metrics and optionally set state
export default function calculateDealMetrics(dealData, setDealData) {
  const {
    arv,
    repairCosts,
    purchasePrice,
    monthlyRent,
    interestRate,
    downPaymentPercent,
    closingCosts
  } = dealData;

  const loanAmount = purchasePrice * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyMortgage = loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const grossRent = monthlyRent * 12;
  const vacancyLoss = grossRent * 0.05;
  const effectiveGrossIncome = grossRent - vacancyLoss;

  const annualExpenses = {
    taxes: 4200,
    insurance: 1800,
    management: monthlyRent * 0.1 * 12,
    repairs: monthlyRent * 0.05 * 12
  };

  const totalExpenses = Object.values(annualExpenses).reduce((a, b) => a + b, 0);
  const noi = effectiveGrossIncome - totalExpenses;

  const annualDebtService = monthlyMortgage * 12;
  const annualCashFlow = noi - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const cashInvested = downPayment + closingCosts + repairCosts;

  const totalInvestment = purchasePrice + closingCosts + repairCosts;
  const profit = arv - totalInvestment;
  const roi = (profit / cashInvested) * 100;
  const coc = (annualCashFlow / cashInvested) * 100;
  const capRate = (noi / purchasePrice) * 100;
  const dscr = noi / annualDebtService;

  const desiredProfit = 40000; // example
  const mao = arv - repairCosts - desiredProfit;

  const dealScore = calculateDealScore({ roi, coc, dscr, capRate, monthlyCashFlow, profit, mao, purchasePrice });
  const riskLevel = determineRiskLevel({ dscr, monthlyCashFlow, roi, mao, purchasePrice });

  setDealData?.(prev => ({
    ...prev,
    metrics: {
      profit,
      roi: roi.toFixed(1),
      coc: coc.toFixed(1),
      dscr: dscr.toFixed(2),
      capRate: capRate.toFixed(1),
      cashFlow: monthlyCashFlow.toFixed(0),
      noi: noi.toFixed(0),
      mao: mao.toFixed(0)
    },
    dealScore,
    riskLevel
  }));
}

// Internal scoring function
function calculateDealScore({ roi, coc, dscr, capRate, monthlyCashFlow, profit, mao, purchasePrice }) {
  let score = 0;

  if (roi >= 30) score += 30;
  else if (roi >= 20) score += 20;
  else if (roi >= 15) score += 10;

  if (dscr >= 1.25) score += 25;
  else if (dscr >= 1.15) score += 15;
  else if (dscr >= 1.0) score += 10;

  if (monthlyCashFlow >= 300) score += 20;
  else if (monthlyCashFlow >= 200) score += 15;
  else if (monthlyCashFlow >= 100) score += 10;

  if (purchasePrice <= mao) score += 15;
  else if (purchasePrice <= mao * 1.05) score += 5;

  if (capRate >= 8) score += 10;
  else if (capRate >= 6) score += 5;

  return score;
}

// Internal risk function
function determineRiskLevel({ dscr, monthlyCashFlow, roi, mao, purchasePrice }) {
  let redFlags = 0;
  if (dscr < 1.1) redFlags++;
  if (monthlyCashFlow < 150) redFlags++;
  if (roi < 15) redFlags++;
  if (purchasePrice > mao) redFlags++;

  if (redFlags === 0) return 'low';
  if (redFlags <= 2) return 'moderate';
  return 'high';
}

// Status helper functions for dashboard
export function getProfitStatus(profit) {
  if (profit >= 50000) return 'good';
  if (profit >= 20000) return 'warning';
  return 'poor';
}

export function getROIStatus(roi) {
  if (roi >= 20) return 'good';
  if (roi >= 10) return 'warning';
  return 'poor';
}

export function getCoCStatus(coc) {
  if (coc >= 10) return 'good';
  if (coc >= 5) return 'warning';
  return 'poor';
}

export function getDSCRStatus(dscr) {
  if (dscr >= 1.25) return 'good';
  if (dscr >= 1.0) return 'warning';
  return 'poor';
}

export function getCapRateStatus(capRate) {
  if (capRate >= 8) return 'good';
  if (capRate >= 6) return 'warning';
  return 'poor';
}

export function getCashFlowStatus(cashFlow) {
  if (cashFlow >= 500) return 'good';
  if (cashFlow >= 200) return 'warning';
  return 'poor';
}