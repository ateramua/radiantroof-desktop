'use client'; // MUST be first line

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import EmptyPortfolioState from './EmptyPortfolioState';
import PortfolioStats from './PortfolioStats';
import PortfolioChart from './PortfolioChart';
import DealFilters from './DealFilters';
import Button from './Button';

export default function PortfolioList() {
  const [savedDeals, setSavedDeals] = useLocalStorage('savedDeals', []);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    dealScore: 'all',
    propertyType: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showComparison, setShowComparison] = useState(false);

  // --- applyFilters function MUST be inside the component
  const applyFilters = () => {
    let filtered = [...savedDeals];

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(deal => deal.riskLevel === filters.riskLevel);
    }

    // Apply deal score filter
    if (filters.dealScore !== 'all') {
      switch (filters.dealScore) {
        case 'high':
          filtered = filtered.filter(deal => deal.dealScore >= 80);
          break;
        case 'medium':
          filtered = filtered.filter(deal => deal.dealScore >= 60 && deal.dealScore < 80);
          break;
        case 'low':
          filtered = filtered.filter(deal => deal.dealScore < 60);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'date-asc':
          return new Date(a.savedAt) - new Date(b.savedAt);
        case 'score-desc':
          return b.dealScore - a.dealScore;
        case 'score-asc':
          return a.dealScore - b.dealScore;
        case 'profit-desc':
          return b.profit - a.profit;
        case 'profit-asc':
          return a.profit - b.profit;
        default:
          return 0;
      }
    });

    setFilteredDeals(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [savedDeals, filters, sortBy]);

  // ...rest of your handlers and JSX here
}