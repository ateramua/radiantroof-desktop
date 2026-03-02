"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PropertiesTable({ 
  properties, 
  onDelete, 
  showAdminControls = false 
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'Sold': 'bg-red-100 text-red-800 border-red-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Under Contract': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Helper functions for decision display
  const getScreeningStatusColor = (status) => {
    const colors = {
      'PASS': 'bg-red-100 text-red-700',
      'INVESTIGATE': 'bg-green-100 text-green-700',
      'FLAG': 'bg-yellow-100 text-yellow-700',
      'REVIEW': 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-500';
  };

  const getAnalysisVerdictColor = (verdict) => {
    const colors = {
      'STRONG BUY': 'bg-green-100 text-green-700',
      'BUY': 'bg-blue-100 text-blue-700',
      'MAYBE': 'bg-yellow-100 text-yellow-700',
      'PASS': 'bg-red-100 text-red-700',
      'REJECT': 'bg-red-100 text-red-700'
    };
    return colors[verdict] || 'bg-gray-100 text-gray-500';
  };

  const getDecisionStatusColor = (status) => {
    const colors = {
      'UNDER_REVIEW': 'bg-blue-100 text-blue-700',
      'OFFER_MADE': 'bg-yellow-100 text-yellow-700',
      'PASS': 'bg-red-100 text-red-700',
      'UNDER_CONTRACT': 'bg-green-100 text-green-700',
      'WITHDRAWN': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Country</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Photo</th>
              {showAdminControls && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <React.Fragment key={property.id}>
                <tr 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition cursor-pointer group"
                  onClick={() => toggleRowExpand(property.id)}
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">#{property.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 group-hover:text-blue-600 transition">
                        <svg 
                          className={`w-4 h-4 transform transition-transform ${expandedRows[property.id] ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600 transition">
                          {property.address || 'Address not specified'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Added {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{property.country || 'USA'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(property.status)}`}>
                      {property.status || 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-600">{formatCurrency(property.price)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {property.photo ? (
                      <a 
                        href={property.photo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No photo</span>
                    )}
                  </td>
                  {showAdminControls && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/properties/edit/${property.id}`}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit property"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(property.id);
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete property"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
                {expandedRows[property.id] && (
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                    <td colSpan={showAdminControls ? 7 : 6} className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Description Section */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            Description
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {property.description || 'No description available for this property.'}
                          </p>
                        </div>

                        {/* Enhanced Workflow Status Section */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Investment Analysis
                          </h4>
                          
                          <div className="space-y-4 text-sm">
                            {/* Screening Status with Decision Data */}
                            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Screening:</span>
                                {property.screening && Object.keys(property.screening).length > 0 ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScreeningStatusColor(property.screening.status)}`}>
                                    {property.screening.status || 'REVIEW'}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Not started</span>
                                )}
                              </div>
                              {property.screening?.score && (
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Score:</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${
                                      property.screening.score >= 70 ? 'text-green-600' :
                                      property.screening.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {property.screening.score}/100
                                    </span>
                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${
                                          property.screening.score >= 70 ? 'bg-green-500' :
                                          property.screening.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${property.screening.score}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {property.screening?.recommendation && (
                                <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                                  💡 {property.screening.recommendation}
                                </div>
                              )}
                            </div>

                            {/* Analysis Status with Decision Data */}
                            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Analysis:</span>
                                {property.analysis && Object.keys(property.analysis).length > 0 ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAnalysisVerdictColor(property.analysis.verdict)}`}>
                                    {property.analysis.verdict || 'REVIEW'}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Not started</span>
                                )}
                              </div>
                              {property.analysis?.dealScore && (
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Deal Score:</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${
                                      property.analysis.dealScore >= 80 ? 'text-green-600' :
                                      property.analysis.dealScore >= 60 ? 'text-blue-600' :
                                      property.analysis.dealScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {property.analysis.dealScore}/100
                                    </span>
                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${
                                          property.analysis.dealScore >= 80 ? 'bg-green-500' :
                                          property.analysis.dealScore >= 60 ? 'bg-blue-500' :
                                          property.analysis.dealScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${property.analysis.dealScore}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {property.analysis?.reasoning && (
                                <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                                  💬 {property.analysis.reasoning}
                                </div>
                              )}
                              {property.analysis?.maxAllowableOffer && (
                                <div className="mt-2 text-xs text-gray-500">
                                  MAO: {formatCurrency(property.analysis.maxAllowableOffer)}
                                </div>
                              )}
                            </div>

                            {/* Decision Status */}
                            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Decision:</span>
                                {property.decision && Object.keys(property.decision).length > 0 ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDecisionStatusColor(property.decision.status)}`}>
                                    {property.decision.status?.replace('_', ' ') || 'PENDING'}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Not started</span>
                                )}
                              </div>
                              {property.decision?.offerDetails?.amount > 0 && (
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Offer Amount:</span>
                                  <span className="text-sm font-medium text-blue-600">
                                    {formatCurrency(property.decision.offerDetails.amount)}
                                  </span>
                                </div>
                              )}
                              {property.decision?.negotiations?.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Negotiation rounds: {property.decision.negotiations.length}
                                </div>
                              )}
                              {property.decision?.finalDecision?.outcome && (
                                <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                                  Final: {property.decision.finalDecision.outcome}
                                  {property.decision.finalDecision.date && ` on ${new Date(property.decision.finalDecision.date).toLocaleDateString()}`}
                                </div>
                              )}
                            </div>

                            {/* Acquisition Status */}
                            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Acquisition:</span>
                                {property.acquisition && Object.keys(property.acquisition).length > 0 ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    property.acquisition.purchased ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {property.acquisition.purchased ? 'ACQUIRED' : 'PENDING'}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Not started</span>
                                )}
                              </div>
                              {property.acquisition?.finalPrice > 0 && (
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Final Price:</span>
                                  <span className="text-sm font-medium text-green-600">
                                    {formatCurrency(property.acquisition.finalPrice)}
                                  </span>
                                </div>
                              )}
                              {property.acquisition?.offers?.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Total offers: {property.acquisition.offers.length}
                                </div>
                              )}
                              {property.acquisition?.actualVsProjected?.variance && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Variance:</span>
                                    <span className={`text-xs font-medium ${
                                      Math.abs(parseFloat(property.acquisition.actualVsProjected.variance)) > 10 
                                        ? 'text-red-600' 
                                        : 'text-green-600'
                                    }`}>
                                      {property.acquisition.actualVsProjected.variance}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        Math.abs(parseFloat(property.acquisition.actualVsProjected.variance)) > 10 
                                          ? 'bg-red-500' 
                                          : 'bg-green-500'
                                      }`}
                                      style={{ 
                                        width: `${Math.min(100, Math.abs(parseFloat(property.acquisition.actualVsProjected.variance)))}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              {property.acquisition?.lessonLearned && (
                                <div className="mt-2 text-xs bg-yellow-50 text-yellow-700 p-2 rounded">
                                  📝 {property.acquisition.lessonLearned}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Metadata Section */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 md:col-span-2">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Additional Information
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs mb-1">Created</p>
                              <p className="font-medium text-gray-800">
                                {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs mb-1">Last Updated</p>
                              <p className="font-medium text-gray-800">
                                {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs mb-1">Property ID</p>
                              <p className="font-mono font-medium text-gray-800">#{property.id}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-xs mb-1">Location</p>
                              <p className="font-medium text-gray-800">{property.country || 'USA'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}