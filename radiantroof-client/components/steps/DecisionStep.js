import React, { useState, useEffect } from "react";
import { updateProperty } from "../../lib/api";

export default function DecisionStep({ propertyId, updateMetrics, propertyData }) {
  const [decision, setDecision] = useState({
    status: "UNDER_REVIEW", // UNDER_REVIEW, OFFER_MADE, PASS, UNDER_CONTRACT, WITHDRAWN
    offerDetails: {
      amount: 0,
      submittedDate: "",
      expirationDate: "",
      contingencies: [],
      escalationClause: "",
      earnestMoney: 0
    },
    negotiations: [],
    committeeVote: {
      for: 0,
      against: 0,
      abstain: 0,
      meetingDate: "",
      notes: ""
    },
    finalDecision: {
      outcome: null, // ACCEPTED, REJECTED, WITHDRAWN, COUNTERED
      reason: "",
      date: "",
      counterOffer: null
    },
    timeline: [],
    notes: ""
  });

  const [newContingency, setNewContingency] = useState("");
  const [negotiationRound, setNegotiationRound] = useState({
    round: 1,
    offer: 0,
    counter: 0,
    date: "",
    notes: ""
  });
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);

  // Load any existing decision data
  useEffect(() => {
    if (propertyData?.decision) {
      setDecision(propertyData.decision);
    }
  }, [propertyData]);

  // Update sidebar with decision status
  useEffect(() => {
    if (updateMetrics) {
      updateMetrics({
        decisionStatus: decision.status,
        offerAmount: decision.offerDetails.amount,
        negotiationRound: decision.negotiations.length
      });
    }
  }, [decision, updateMetrics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('offer.')) {
      const field = name.split('.')[1];
      setDecision(prev => ({
        ...prev,
        offerDetails: {
          ...prev.offerDetails,
          [field]: value
        }
      }));
    } else {
      setDecision(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('offer.')) {
      const field = name.split('.')[1];
      setDecision(prev => ({
        ...prev,
        offerDetails: {
          ...prev.offerDetails,
          [field]: Number(value)
        }
      }));
    } else if (name.startsWith('vote.')) {
      const field = name.split('.')[1];
      setDecision(prev => ({
        ...prev,
        committeeVote: {
          ...prev.committeeVote,
          [field]: Number(value)
        }
      }));
    } else {
      setDecision(prev => ({ ...prev, [name]: Number(value) }));
    }
  };

  const addContingency = () => {
    if (newContingency.trim()) {
      setDecision(prev => ({
        ...prev,
        offerDetails: {
          ...prev.offerDetails,
          contingencies: [...prev.offerDetails.contingencies, newContingency.trim()]
        }
      }));
      setNewContingency("");
    }
  };

  const removeContingency = (index) => {
    setDecision(prev => ({
      ...prev,
      offerDetails: {
        ...prev.offerDetails,
        contingencies: prev.offerDetails.contingencies.filter((_, i) => i !== index)
      }
    }));
  };

  const addNegotiationRound = () => {
    const newRound = {
      ...negotiationRound,
      round: decision.negotiations.length + 1,
      date: new Date().toISOString().split('T')[0]
    };
    
    setDecision(prev => ({
      ...prev,
      negotiations: [...prev.negotiations, newRound]
    }));
    
    setNegotiationRound({
      round: decision.negotiations.length + 2,
      offer: 0,
      counter: 0,
      date: "",
      notes: ""
    });
    setShowNegotiationForm(false);
  };

  const makeDecision = (outcome, counterAmount = null) => {
    const finalDecision = {
      outcome,
      reason: decision.notes,
      date: new Date().toISOString().split('T')[0],
      counterOffer: counterAmount
    };

    let newStatus = decision.status;
    if (outcome === 'ACCEPTED') newStatus = 'UNDER_CONTRACT';
    if (outcome === 'REJECTED') newStatus = 'PASS';
    if (outcome === 'WITHDRAWN') newStatus = 'WITHDRAWN';
    if (outcome === 'COUNTERED') newStatus = 'OFFER_MADE';

    setDecision(prev => ({
      ...prev,
      status: newStatus,
      finalDecision
    }));
  };

  const addTimelineEvent = (event) => {
    setDecision(prev => ({
      ...prev,
      timeline: [...prev.timeline, {
        ...event,
        timestamp: new Date().toISOString()
      }]
    }));
  };

  const handleSave = async () => {
    try {
      // Calculate days in negotiation
      const firstOfferDate = decision.negotiations[0]?.date;
      const daysInNegotiation = firstOfferDate 
        ? Math.round((new Date() - new Date(firstOfferDate)) / (1000 * 60 * 60 * 24))
        : 0;

      // Structured decision data
      const decisionData = {
        status: decision.status,
        offerDetails: {
          amount: decision.offerDetails.amount,
          submittedDate: decision.offerDetails.submittedDate || new Date().toISOString().split('T')[0],
          expirationDate: decision.offerDetails.expirationDate,
          contingencies: decision.offerDetails.contingencies,
          escalationClause: decision.offerDetails.escalationClause,
          earnestMoney: decision.offerDetails.earnestMoney
        },
        negotiationHistory: decision.negotiations.map(round => ({
          round: round.round,
          offer: round.offer,
          counter: round.counter,
          date: round.date,
          notes: round.notes
        })),
        committeeVote: decision.committeeVote.for + decision.committeeVote.against > 0 ? {
          for: decision.committeeVote.for,
          against: decision.committeeVote.against,
          abstain: decision.committeeVote.abstain,
          meetingDate: decision.committeeVote.meetingDate || new Date().toISOString().split('T')[0],
          outcome: decision.committeeVote.for > decision.committeeVote.against ? 'APPROVED' : 'REJECTED',
          notes: decision.committeeVote.notes
        } : null,
        finalDecision: decision.finalDecision.outcome ? {
          outcome: decision.finalDecision.outcome,
          reason: decision.finalDecision.reason,
          date: decision.finalDecision.date,
          counterOffer: decision.finalDecision.counterOffer
        } : null,
        metrics: {
          daysInNegotiation,
          totalOffers: decision.negotiations.length,
          currentStatus: decision.status,
          lastUpdated: new Date().toISOString()
        },
        timeline: decision.timeline,
        notes: decision.notes
      };

      await updateProperty(propertyId, { decision: decisionData });

      // Show appropriate message based on decision
      const messages = {
        UNDER_REVIEW: "📋 Decision saved - Property is under review",
        OFFER_MADE: "💰 Offer recorded - Waiting for response",
        PASS: "⛔ Decision saved - Property passed on",
        UNDER_CONTRACT: "🎉 Congratulations! Property is under contract",
        WITHDRAWN: "🔄 Offer withdrawn"
      };

      alert(messages[decision.status] || "Decision data saved successfully!");

      // Add timeline event
      addTimelineEvent({
        type: 'DECISION_SAVED',
        status: decision.status,
        notes: `Decision updated to ${decision.status}`
      });

    } catch (error) {
      console.error("Failed to save decision:", error);
      alert("Error saving decision data");
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800 border-blue-200',
      'OFFER_MADE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PASS': 'bg-red-100 text-red-800 border-red-200',
      'UNDER_CONTRACT': 'bg-green-100 text-green-800 border-green-200',
      'WITHDRAWN': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Investment Decision</h3>

      {/* Status Dashboard */}
      <div className={`p-4 rounded-lg border ${getStatusBadge(decision.status)}`}>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Current Status:</span>
          <span className="text-lg font-bold">{decision.status.replace('_', ' ')}</span>
        </div>
        {decision.finalDecision.outcome && (
          <div className="mt-2 text-sm">
            Final Outcome: {decision.finalDecision.outcome} - {decision.finalDecision.date}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 p-3 rounded text-center">
          <div className="text-xs text-blue-600">Offer Amount</div>
          <div className="text-lg font-bold text-blue-700">
            ${decision.offerDetails.amount.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <div className="text-xs text-green-600">Negotiation Rounds</div>
          <div className="text-lg font-bold text-green-700">
            {decision.negotiations.length}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded text-center">
          <div className="text-xs text-purple-600">Contingencies</div>
          <div className="text-lg font-bold text-purple-700">
            {decision.offerDetails.contingencies.length}
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Update Status</h4>
        <select
          name="status"
          value={decision.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="OFFER_MADE">Offer Made</option>
          <option value="PASS">Pass</option>
          <option value="UNDER_CONTRACT">Under Contract</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>

      {/* Offer Details */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Offer Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Offer Amount ($)</label>
            <input
              type="number"
              name="offer.amount"
              value={decision.offerDetails.amount}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Earnest Money ($)</label>
            <input
              type="number"
              name="offer.earnestMoney"
              value={decision.offerDetails.earnestMoney}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Submitted Date</label>
            <input
              type="date"
              name="offer.submittedDate"
              value={decision.offerDetails.submittedDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Expiration Date</label>
            <input
              type="date"
              name="offer.expirationDate"
              value={decision.offerDetails.expirationDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium">Escalation Clause</label>
            <input
              type="text"
              name="offer.escalationClause"
              value={decision.offerDetails.escalationClause}
              onChange={handleChange}
              placeholder="e.g., $1,000 over highest offer up to $350,000"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Contingencies */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Contingencies</h4>
        <div className="space-y-2">
          {decision.offerDetails.contingencies.map((cont, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>{cont}</span>
              <button
                onClick={() => removeContingency(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newContingency}
              onChange={(e) => setNewContingency(e.target.value)}
              placeholder="Add contingency..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addContingency}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Negotiation History */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Negotiation History</h4>
        
        {decision.negotiations.map((round, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">Round {round.round}</span>
              <span className="text-sm text-gray-500">{round.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>Offer: ${round.offer?.toLocaleString()}</div>
              <div>Counter: ${round.counter?.toLocaleString()}</div>
            </div>
            {round.notes && <p className="text-sm text-gray-600 mt-1">{round.notes}</p>}
          </div>
        ))}

        {showNegotiationForm ? (
          <div className="mt-3 p-3 border rounded">
            <h5 className="font-medium mb-2">Add Negotiation Round</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Your Offer ($)</label>
                <input
                  type="number"
                  value={negotiationRound.offer}
                  onChange={(e) => setNegotiationRound({...negotiationRound, offer: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Counter Offer ($)</label>
                <input
                  type="number"
                  value={negotiationRound.counter}
                  onChange={(e) => setNegotiationRound({...negotiationRound, counter: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm">Notes</label>
                <textarea
                  value={negotiationRound.notes}
                  onChange={(e) => setNegotiationRound({...negotiationRound, notes: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={addNegotiationRound}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save Round
              </button>
              <button
                onClick={() => setShowNegotiationForm(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNegotiationForm(true)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Negotiation Round
          </button>
        )}
      </div>

      {/* Committee Vote */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Committee Vote</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">For</label>
            <input
              type="number"
              name="vote.for"
              value={decision.committeeVote.for}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm">Against</label>
            <input
              type="number"
              name="vote.against"
              value={decision.committeeVote.against}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm">Abstain</label>
            <input
              type="number"
              name="vote.abstain"
              value={decision.committeeVote.abstain}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm">Meeting Notes</label>
            <textarea
              name="vote.notes"
              value={decision.committeeVote.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>
        </div>
      </div>

      {/* Final Decision Actions */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Make Final Decision</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => makeDecision('ACCEPTED')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✓ Accept Offer
          </button>
          <button
            onClick={() => makeDecision('REJECTED')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ✗ Reject Offer
          </button>
          <button
            onClick={() => {
              const counter = prompt("Enter counter offer amount:");
              if (counter) makeDecision('COUNTERED', Number(counter));
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            ↺ Counter Offer
          </button>
          <button
            onClick={() => makeDecision('WITHDRAWN')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ↩ Withdraw Offer
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t pt-4">
        <label className="block mb-1 font-medium">Decision Notes</label>
        <textarea
          name="notes"
          value={decision.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Document your decision-making process, key considerations, and any important notes..."
        />
      </div>

      {/* Timeline Preview */}
      {decision.timeline.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Recent Timeline</h4>
          <div className="space-y-2 text-sm">
            {decision.timeline.slice(-3).map((event, index) => (
              <div key={index} className="flex items-start gap-2 text-gray-600">
                <span className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
                <span>{event.notes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
      >
        Save Decision
      </button>
    </div>
  );
}