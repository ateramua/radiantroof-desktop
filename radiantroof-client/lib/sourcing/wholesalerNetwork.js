"use client";
import { useState } from 'react';
import { createDeal } from '@/lib/sourcing/models';
import { ScoringEngine } from '@/lib/sourcing/scoringEngine';

export default function WholesalerNetwork({ onNewDeal }) {
  const [wholesalers, setWholesalers] = useState([
    { id: 1, name: 'Michael Rodriguez', rating: 4.8, deals: 12, areas: ['East Austin', 'Round Rock'], phone: '512-555-1234' },
    { id: 2, name: 'Sarah Chen', rating: 4.9, deals: 8, areas: ['North Austin', 'Cedar Park'], phone: '512-555-5678' },
    { id: 3, name: 'James Wilson', rating: 4.5, deals: 6, areas: ['South Austin', 'Kyle'], phone: '512-555-9012' }
  ]);

  const [newDeal, setNewDeal] = useState({
    wholesalerId: '',
    address: '',
    askingPrice: '',
    arv: '',
    repairs: '',
    notes: ''
  });

  const [recentDeals, setRecentDeals] = useState([]);

  const handleSubmitDeal = (e) => {
    e.preventDefault();
    
    const wholesaler = wholesalers.find(w => w.id === parseInt(newDeal.wholesalerId));
    
    // Create deal object
    const deal = createDeal({
      address: newDeal.address,
      askingPrice: parseFloat(newDeal.askingPrice),
      estimatedArv: parseFloat(newDeal.arv),
      estimatedRepairs: parseFloat(newDeal.repairs),
      sourceType: 'wholesaler',
      sourceDetail: wholesaler?.name,
      sourceContact: wholesaler?.phone,
      notes: newDeal.notes
    });

    // Score the deal
    const scoringEngine = new ScoringEngine();
    const scored = scoringEngine.scoreDeal(deal);
    deal.score = scored.score;
    deal.priority = scored.priority;
    deal.scoringSummary = scored.summary;

    // Add to recent deals
    setRecentDeals([deal, ...recentDeals].slice(0, 5));
    
    // Notify parent
    if (onNewDeal) onNewDeal(deal);

    // Reset form
    setNewDeal({
      wholesalerId: '',
      address: '',
      askingPrice: '',
      arv: '',
      repairs: '',
      notes: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">🤝 Wholesaler & Agent Network</h3>

      {/* Top Wholesalers */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Top Wholesalers</h4>
        <div className="space-y-2">
          {wholesalers.map(w => (
            <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-xs text-gray-500">⭐ {w.rating} • {w.deals} deals • {w.areas.join(', ')}</p>
              </div>
              <button className="text-blue-600 text-sm hover:underline">
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit New Deal Form */}
      <form onSubmit={handleSubmitDeal} className="space-y-4">
        <h4 className="font-medium">Submit New Deal</h4>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Wholesaler</label>
          <select
            required
            value={newDeal.wholesalerId}
            onChange={(e) => setNewDeal({...newDeal, wholesalerId: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select wholesaler</option>
            {wholesalers.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Property Address</label>
          <input
            type="text"
            required
            value={newDeal.address}
            onChange={(e) => setNewDeal({...newDeal, address: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="123 Main St, Austin, TX"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Asking Price</label>
            <input
              type="number"
              required
              value={newDeal.askingPrice}
              onChange={(e) => setNewDeal({...newDeal, askingPrice: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ARV</label>
            <input
              type="number"
              required
              value={newDeal.arv}
              onChange={(e) => setNewDeal({...newDeal, arv: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Repairs</label>
            <input
              type="number"
              required
              value={newDeal.repairs}
              onChange={(e) => setNewDeal({...newDeal, repairs: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="$"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Notes</label>
          <textarea
            value={newDeal.notes}
            onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
            rows="2"
            placeholder="Any additional details about the deal..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Deal for Scoring
        </button>
      </form>

      {/* Recent Deals from Network */}
      {recentDeals.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Recent Submissions</h4>
          <div className="space-y-2">
            {recentDeals.map((deal, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{deal.address}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    deal.priority === 'hot' ? 'bg-red-100 text-red-800' :
                    deal.priority === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {deal.priority?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{deal.scoringSummary}</p>
                <div className="flex justify-between text-xs mt-2">
                  <span>💰 ${deal.askingPrice?.toLocaleString()}</span>
                  <span>📈 Score: {deal.score}</span>
                  <span>💵 Profit: ${deal.estimatedProfit?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}