import React, { useState, useEffect } from "react";
import { updateProperty, fetchOffers, addOffer } from "../../lib/api";

export default function AcquisitionStep({ propertyId, updateMetrics }) {
  const [acquisition, setAcquisition] = useState({
    closeDate: "",
    finalPrice: 0,
    financingDetails: "",
    notes: "",
    lessonLearned: "",
    purchased: false
  });

  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    amount: 0,
    terms: "",
    status: "PENDING" // PENDING, ACCEPTED, REJECTED, COUNTERED
  });

  const [projectedMetrics, setProjectedMetrics] = useState({
    projectedProfit: 0,
    projectedARV: 0,
    projectedRepairs: 0
  });

  useEffect(() => {
    async function loadOffers() {
      try {
        const fetched = await fetchOffers(propertyId);
        setOffers(fetched);
      } catch (error) {
        console.error("Failed to load offers:", error);
      }
    }
    loadOffers();
  }, [propertyId]);

  // Load projected metrics from analysis or screening
  useEffect(() => {
    // This would ideally come from the property data
    // For now, using mock data
    setProjectedMetrics({
      projectedProfit: 55000,
      projectedARV: 425000,
      projectedRepairs: 45000
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAcquisition((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ 
      ...prev, 
      [name]: name === 'amount' ? Number(value) : value 
    }));
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      const updatedOffers = await addOffer(propertyId, newOffer);
      setOffers(updatedOffers);
      setNewOffer({ amount: 0, terms: "", status: "PENDING" });
      alert("Offer added successfully!");
    } catch (error) {
      console.error("Failed to add offer:", error);
      alert("Error adding offer");
    }
  };

  const calculateVariance = () => {
    if (!projectedMetrics.projectedProfit || !acquisition.finalPrice) return null;
    
    const actualVsProjected = {
      projectedProfit: projectedMetrics.projectedProfit,
      actualProfit: acquisition.finalPrice - (projectedMetrics.projectedARV - projectedMetrics.projectedRepairs),
      variance: 0,
      reason: acquisition.notes || "No reason provided"
    };
    
    actualVsProjected.variance = ((actualVsProjected.actualProfit - actualVsProjected.projectedProfit) / actualVsProjected.projectedProfit * 100).toFixed(1);
    
    return actualVsProjected;
  };

  const getOfferStatusBadge = (status) => {
    const badges = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'COUNTERED': 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSave = async () => {
    try {
      const actualVsProjected = calculateVariance();
      
      // Determine if property was purchased
      const purchased = acquisition.finalPrice > 0 && acquisition.closeDate !== "";
      
      // Structured acquisition data matching the desired JSON format
      const acquisitionData = {
        purchased: purchased,
        finalPrice: acquisition.finalPrice,
        closingDate: acquisition.closeDate,
        financing: {
          type: acquisition.financingDetails.includes("loan") ? "Financed" : 
                acquisition.financingDetails.includes("cash") ? "Cash" : "Other",
          details: acquisition.financingDetails
        },
        closingCosts: 0, // This could be added as a separate field if needed
        lessonLearned: acquisition.lessonLearned || "No lessons recorded yet",
        actualVsProjected: actualVsProjected || {
          projectedProfit: 0,
          actualProfit: 0,
          variance: "0%",
          reason: "Insufficient data"
        },
        offers: offers,
        notes: acquisition.notes
      };

      await updateProperty(propertyId, { acquisition: acquisitionData });
      
      if (purchased) {
        alert(`✅ Property acquired successfully for $${acquisition.finalPrice.toLocaleString()}!`);
      } else {
        alert("Acquisition data saved");
      }
      
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  // Calculate if we have a successful acquisition
  const isAcquired = acquisition.finalPrice > 0 && acquisition.closeDate !== "";
  
  // Calculate total offers
  const acceptedOffers = offers.filter(o => o.status === "ACCEPTED").length;
  const pendingOffers = offers.filter(o => o.status === "PENDING").length;

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Acquisition Details</h3>

      {/* Acquisition Status Dashboard */}
      {isAcquired && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Property Acquired Successfully</span>
          </div>
          <p className="text-sm text-green-600">
            Final Price: ${acquisition.finalPrice.toLocaleString()} | 
            Close Date: {new Date(acquisition.closeDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded text-center">
          <div className="text-xs text-blue-600">Total Offers</div>
          <div className="text-xl font-bold text-blue-700">{offers.length}</div>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <div className="text-xs text-green-600">Accepted</div>
          <div className="text-xl font-bold text-green-700">{acceptedOffers}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded text-center">
          <div className="text-xs text-yellow-600">Pending</div>
          <div className="text-xl font-bold text-yellow-700">{pendingOffers}</div>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Close Date</label>
          <input
            type="date"
            name="closeDate"
            value={acquisition.closeDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Final Price ($)</label>
          <input
            type="number"
            name="finalPrice"
            value={acquisition.finalPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Financing Details</label>
        <textarea
          name="financingDetails"
          value={acquisition.financingDetails}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="2"
          placeholder="e.g., Conventional loan at 6.25%, 20% down"
        />
      </div>

      {/* Lesson Learned Field - New */}
      <div>
        <label className="block mb-1 font-medium">📝 Lesson Learned</label>
        <textarea
          name="lessonLearned"
          value={acquisition.lessonLearned}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="2"
          placeholder="What would you do differently next time?"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <textarea
          name="notes"
          value={acquisition.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      {/* Offers Section */}
      <div className="border-t pt-4">
        <h4 className="font-bold mb-3">Offers</h4>
        
        {/* Add New Offer Form */}
        <div className="mb-4 bg-gray-50 p-4 rounded">
          <h5 className="font-semibold mb-3">Add New Offer</h5>
          <form onSubmit={handleAddOffer} className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Offer Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={newOffer.amount}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Terms</label>
                <input
                  type="text"
                  name="terms"
                  value={newOffer.terms}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Cash, Financing"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={newOffer.status}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COUNTERED">Countered</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Add Offer
            </button>
          </form>
        </div>

        {/* Existing Offers List */}
        <div className="space-y-2">
          <h5 className="font-semibold">Offer History</h5>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers yet</p>
          ) : (
            offers.map((offer, index) => (
              <div key={index} className="border p-3 rounded hover:shadow transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">${offer.amount?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{offer.terms}</p>
                    <p className="text-xs text-gray-400">
                      Added: {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getOfferStatusBadge(offer.status)}`}>
                    {offer.status || 'PENDING'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Projected vs Actual Comparison */}
      {isAcquired && (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-3">📊 Projected vs Actual</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Projected Profit</p>
              <p className="text-lg font-bold text-blue-600">
                ${projectedMetrics.projectedProfit.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Actual Profit</p>
              <p className="text-lg font-bold text-green-600">
                ${(acquisition.finalPrice - (projectedMetrics.projectedARV - projectedMetrics.projectedRepairs)).toLocaleString()}
              </p>
            </div>
          </div>
          {calculateVariance() && (
            <div className={`mt-2 text-sm ${Math.abs(calculateVariance().variance) > 10 ? 'text-red-600' : 'text-green-600'}`}>
              Variance: {calculateVariance().variance}%
              {Math.abs(calculateVariance().variance) > 10 && " - Review your underwriting assumptions"}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
      >
        {isAcquired ? 'Update Acquisition Details' : 'Save Acquisition Details'}
      </button>
    </div>
  );
}