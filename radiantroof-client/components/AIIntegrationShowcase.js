"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIIntegrationShowcase() {
  const [activeFeature, setActiveFeature] = useState("overview");
  const [expandedStep, setExpandedStep] = useState(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const toggleStep = (step) => {
    if (expandedStep === step) {
      setExpandedStep(null);
    } else {
      setExpandedStep(step);
    }
  };

  const aiFeatures = {
    criteria: [
      { 
        feature: "Smart Criteria Generator", 
        description: "AI analyzes your profile and suggests optimal investment criteria",
        impact: "Premium tier feature",
        icon: "🎯"
      },
      { 
        feature: "Market Intelligence", 
        description: "Real-time market data integrated into criteria recommendations",
        impact: "Subscription add-on",
        icon: "📊"
      },
      { 
        feature: "Competitive Analysis", 
        description: "See what similar investors are looking for",
        impact: "Data insights package",
        icon: "👥"
      },
      { 
        feature: "Risk Assessment", 
        description: "AI evaluates your criteria against market conditions",
        impact: "Risk management tool",
        icon: "⚠️"
      }
    ],
    screening: [
      { 
        feature: "Automated ARV Estimation", 
        description: "AI analyzes comps and market data",
        impact: "Time savings = more deals",
        icon: "💰"
      },
      { 
        feature: "Red Flag Detection", 
        description: "Scans public records for issues",
        impact: "Risk reduction",
        icon: "🚩"
      },
      { 
        feature: "Renovation Cost Estimator", 
        description: "AI estimates repair costs from photos",
        impact: "Accuracy improvement",
        icon: "🔨"
      },
      { 
        feature: "Neighborhood Analyzer", 
        description: "School ratings, crime stats, trends",
        impact: "Better location decisions",
        icon: "🏘️"
      }
    ],
    analysis: [
      { 
        feature: "Monte Carlo Simulation", 
        description: "10,000 scenarios to assess risk",
        impact: "Premium feature",
        icon: "📈"
      },
      { 
        feature: "Tax Strategy Optimizer", 
        description: "AI suggests tax-efficient structures",
        impact: "High-value add-on",
        icon: "💰"
      },
      { 
        feature: "Financing Advisor", 
        description: "Compares loan options in real-time",
        impact: "Partner revenue share",
        icon: "🏦"
      },
      { 
        feature: "Exit Strategy Planner", 
        description: "Predicts best time to sell/refinance",
        impact: "Strategic advisory",
        icon: "📅"
      }
    ],
    decision: [
      { 
        feature: "Offer Optimizer", 
        description: "AI suggests optimal offer based on probabilities",
        impact: "Higher win rates",
        icon: "💵"
      },
      { 
        feature: "Negotiation Scripts", 
        description: "Real-time response suggestions",
        impact: "Confidence building",
        icon: "🤝"
      },
      { 
        feature: "Seller Psychology Profile", 
        description: "Analyzes seller behavior patterns",
        impact: "Better outcomes",
        icon: "🧠"
      },
      { 
        feature: "Deal Predictor", 
        description: "Probability of acceptance at various price points",
        impact: "Strategic advantage",
        icon: "🎯"
      }
    ],
    acquisition: [
      { 
        feature: "Deal Autopsy", 
        description: "AI analyzes why deals succeeded/failed",
        impact: "Continuous improvement",
        icon: "🔍"
      },
      { 
        feature: "Criteria Refinement", 
        description: "Automatically updates your criteria based on outcomes",
        impact: "Better future deals",
        icon: "🔄"
      },
      { 
        feature: "Predictive Analytics", 
        description: "Learns which factors predict success",
        impact: "Competitive advantage",
        icon: "📊"
      },
      { 
        feature: "Portfolio Insights", 
        description: "Identifies patterns across your deals",
        impact: "Strategic planning",
        icon: "📁"
      }
    ]
  };

  const revenueTiers = [
    { tier: "Free", price: "$0", features: ["Manual inputs", "Basic calculations"] },
    { tier: "Pro", price: "$49/month", features: ["AI screening", "Basic analysis", "Deal scoring"] },
    { tier: "Enterprise", price: "$199/month", features: ["Full AI suite", "Portfolio analytics", "API access"] },
    { tier: "Success Fee", price: "1%", features: ["Percentage of deal savings from AI negotiations"] },
    { tier: "White Label", price: "Custom", features: ["Your own branded AI investment platform"] }
  ];

  const roadmap = [
    { phase: "Phase 1: MVP", timeline: "3 months", items: ["AI-powered ARV estimation", "Basic deal scoring", "Automated red flag detection"] },
    { phase: "Phase 2: Growth", timeline: "6 months", items: ["Full negotiation assistant", "Portfolio analytics", "Market intelligence feeds"] },
    { phase: "Phase 3: Scale", timeline: "12 months", items: ["Predictive deal matching", "Autonomous deal sourcing", "White-label platform"] }
  ];

  const roiProjections = [
    { metric: "Deals per analyst/month", withoutAI: "5", withAI: "15", improvement: "200%" },
    { metric: "Decision time per deal", withoutAI: "4 hours", withAI: "1 hour", improvement: "75%" },
    { metric: "Accuracy rate", withoutAI: "70%", withAI: "85%", improvement: "21%" },
    { metric: "Revenue per analyst", withoutAI: "$500K", withAI: "$1.5M", improvement: "200%" },
    { metric: "Platform revenue", withoutAI: "$0", withAI: "$50K/month", improvement: "∞" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          🤖 AI-Powered Investment Features
        </h2>
        <p className="text-green-100 text-sm mt-1">
          Transform your investment workflow with intelligent automation
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 overflow-x-auto">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveFeature("overview")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeFeature === "overview"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🚀 Strategic Overview
          </button>
          <button
            onClick={() => setActiveFeature("features")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeFeature === "features"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            ⚡ AI Features by Step
          </button>
          <button
            onClick={() => setActiveFeature("revenue")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeFeature === "revenue"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            💰 Revenue Model
          </button>
          <button
            onClick={() => setActiveFeature("roadmap")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeFeature === "roadmap"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📅 Implementation Roadmap
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {/* Overview Tab */}
        {activeFeature === "overview" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">🚀 Executive Summary</h3>
              <p className="text-sm text-blue-700">
                By integrating ChatGPT API across your investment workflow, you can reduce decision time by 70%, 
                increase deal flow, improve accuracy, create new revenue streams, and scale without headcount.
              </p>
            </div>

            {/* ROI Projections */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h4 className="font-semibold">📊 ROI Projections</h4>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Metric</th>
                    <th className="px-4 py-2 text-left">Without AI</th>
                    <th className="px-4 py-2 text-left">With AI</th>
                    <th className="px-4 py-2 text-left">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {roiProjections.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 font-medium">{item.metric}</td>
                      <td className="px-4 py-2">{item.withoutAI}</td>
                      <td className="px-4 py-2 text-green-600 font-medium">{item.withAI}</td>
                      <td className="px-4 py-2 text-blue-600">{item.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Copilot Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🌟 AI Deal Copilot - Your 24/7 Investment Assistant</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded border-l-4 border-green-500">
                  <span className="font-medium">Alert:</span> "Based on your criteria, 3 new properties match your profile in Austin"
                </div>
                <div className="bg-white p-2 rounded border-l-4 border-blue-500">
                  <span className="font-medium">Insight:</span> "Prices in your target area have dropped 5% - good time to buy"
                </div>
                <div className="bg-white p-2 rounded border-l-4 border-purple-500">
                  <span className="font-medium">Suggest:</span> "Property #123 has 90% match with your successful deals"
                </div>
                <div className="bg-white p-2 rounded border-l-4 border-red-500">
                  <span className="font-medium">Warning:</span> "This property has similar red flags to your last loss"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeFeature === "features" && (
          <div className="space-y-3">
            {["criteria", "screening", "analysis", "decision", "acquisition"].map((step) => (
              <div key={step} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(step)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="font-semibold capitalize">{step} Step - AI Features</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedStep === step ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedStep === step && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiFeatures[step].map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-3 hover:shadow-md transition">
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <h5 className="font-medium text-sm">{item.feature}</h5>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              <p className="text-xs text-green-600 mt-1 font-medium">{item.impact}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Cross-Step Features */}
            <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="px-4 py-3 bg-blue-100">
                <h4 className="font-semibold">🌟 Cross-Step AI Features</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2">Automated Deal Scoring</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Criteria:</span>
                        <span className="text-green-600 font-bold">0.85</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Screening:</span>
                        <span className="text-green-600 font-bold">0.92</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analysis:</span>
                        <span className="text-yellow-600 font-bold">0.78</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span className="font-medium">Overall:</span>
                        <span className="text-green-600 font-bold">0.88 - STRONG BUY</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2">Portfolio Intelligence</h5>
                    <p className="text-xs text-gray-600 mb-1">"Consider selling Property A to free up capital"</p>
                    <p className="text-xs text-gray-600 mb-1">"Add commercial properties to balance risk"</p>
                    <p className="text-xs text-green-600">"3 off-market deals available"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeFeature === "revenue" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {revenueTiers.map((tier, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">{tier.tier}</h4>
                    <span className="text-green-600 font-bold">{tier.price}</span>
                  </div>
                  <ul className="space-y-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Monetization Strategy</h4>
              <p className="text-sm text-yellow-700">
                Start with per-analysis pricing, build to subscriptions, and scale to enterprise 
                white-label solutions. Success fees create alignment with investor outcomes.
              </p>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeFeature === "roadmap" && (
          <div className="space-y-4">
            {roadmap.map((phase, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                  <h4 className="font-semibold">{phase.phase}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {phase.timeline}
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🔮 Future Possibilities</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="bg-white p-2 rounded">🎤 Voice Interface</span>
                <span className="bg-white p-2 rounded">🤖 Automated Offers</span>
                <span className="bg-white p-2 rounded">🔧 Predictive Maintenance</span>
                <span className="bg-white p-2 rounded">👥 AI Tenant Screening</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          AI-powered investing is the future
        </span>
        <Link href="/contact" className="text-green-600 hover:text-green-800 font-medium">
          Request Early Access →
        </Link>
      </div>
    </div>
  );
}