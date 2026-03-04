"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const DealContext = createContext();

export function DealProvider({ children }) {
  const [currentDeal, setCurrentDeal] = useState(null);
  const [dealHistory, setDealHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currentDeal');
      if (saved) {
        setCurrentDeal(JSON.parse(saved));
      }
      
      const history = localStorage.getItem('dealHistory');
      if (history) {
        setDealHistory(JSON.parse(history));
      }
    } catch (e) {
      console.error('Error loading deal data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever deal changes
  useEffect(() => {
    if (currentDeal) {
      localStorage.setItem('currentDeal', JSON.stringify(currentDeal));
    }
  }, [currentDeal]);

  // Save history when it changes
  useEffect(() => {
    if (dealHistory.length > 0) {
      localStorage.setItem('dealHistory', JSON.stringify(dealHistory));
    }
  }, [dealHistory]);

  // Update current deal with new data
  const updateDeal = (dealData) => {
    setCurrentDeal(prev => {
      const updated = {
        ...prev,
        ...dealData,
        lastUpdated: new Date().toISOString()
      };
      return updated;
    });
  };

  // Create a new deal from sourcing
  const createNewDeal = (dealData) => {
    const newDeal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentPhase: 'sourcing',
      ...dealData
    };
    
    setCurrentDeal(newDeal);
    setDealHistory(prev => [newDeal, ...prev].slice(0, 50)); // Keep last 50 deals
    
    return newDeal;
  };

  // Move deal to next phase
  const advanceToPhase = (phase) => {
    if (!currentDeal) return;
    
    const phaseOrder = ['sourcing', 'screening', 'analysis', 'acquisition', 'renovation', 'exit'];
    const currentIndex = phaseOrder.indexOf(currentDeal.currentPhase);
    const newIndex = phaseOrder.indexOf(phase);
    
    if (newIndex > currentIndex) {
      setCurrentDeal(prev => ({
        ...prev,
        currentPhase: phase,
        lastUpdated: new Date().toISOString(),
        [`${phase}StartedAt`]: new Date().toISOString()
      }));
      
      // Update in history too
      setDealHistory(prev => 
        prev.map(deal => 
          deal.id === currentDeal.id 
            ? { ...deal, currentPhase: phase, lastUpdated: new Date().toISOString() }
            : deal
        )
      );
    }
  };

  // Load a specific deal from history
  const loadDeal = (dealId) => {
    const deal = dealHistory.find(d => d.id === dealId);
    if (deal) {
      setCurrentDeal(deal);
    }
  };

  // Clear current deal (for new property)
  const clearCurrentDeal = () => {
    setCurrentDeal(null);
  };

  return (
    <DealContext.Provider value={{
      currentDeal,
      dealHistory,
      isLoading,
      updateDeal,
      createNewDeal,
      advanceToPhase,
      loadDeal,
      clearCurrentDeal
    }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error('useDeal must be used within a DealProvider');
  }
  return context;
}