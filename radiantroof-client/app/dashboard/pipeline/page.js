"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

// Drag and drop icons (simplified - we'll use emoji)
const DragHandle = () => <span className="text-gray-400 cursor-move mr-2">⋮⋮</span>;

// Property Card Component
const PropertyCard = ({ property, onDragStart, onDragEnd, onMove }) => {
  // Determine card color based on priority/status
  const getCardColor = () => {
    if (property.priority === 'hot') return 'bg-red-50 border-red-200';
    if (property.priority === 'warm') return 'bg-yellow-50 border-yellow-200';
    if (property.stage === 'exit') return 'bg-green-50 border-green-200';
    if (property.stage === 'renovate') return 'bg-blue-50 border-blue-200';
    return 'bg-white';
  };

  // Get stage-specific actions
  const getStageActions = () => {
    switch(property.stage) {
      case 'source':
        return (
          <button 
            onClick={() => onMove(property.id, 'screen')}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Move to Screen
          </button>
        );
      case 'screen':
        return (
          <button 
            onClick={() => onMove(property.id, 'analyze')}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Move to Analyze
          </button>
        );
      case 'analyze':
        return (
          <button 
            onClick={() => onMove(property.id, 'acquire')}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Make Offer
          </button>
        );
      case 'acquire':
        return (
          <div className="flex space-x-1">
            <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
              Accept
            </button>
            <button className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700">
              Counter
            </button>
          </div>
        );
      case 'renovate':
        return (
          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
            Update Progress
          </button>
        );
      case 'exit':
        return (
          <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
            Review Offers
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`border rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition cursor-grab ${getCardColor()}`}
      draggable
      onDragStart={(e) => onDragStart(e, property)}
      onDragEnd={onDragEnd}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <DragHandle />
          <div>
            <h4 className="font-medium text-sm">{property.address}</h4>
            <p className="text-xs text-gray-500">{property.city}, {property.state}</p>
          </div>
        </div>
        {property.priority === 'hot' && (
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">🔥 Hot</span>
        )}
      </div>

      {/* Property Details */}
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
        <div>
          <span className="text-gray-400">Price:</span>
          <span className="ml-1 font-medium">${property.price?.toLocaleString() || '—'}</span>
        </div>
        <div>
          <span className="text-gray-400">ARV:</span>
          <span className="ml-1 font-medium">${property.arv?.toLocaleString() || '—'}</span>
        </div>
        <div>
          <span className="text-gray-400">Profit:</span>
          <span className={`ml-1 font-medium ${property.profit > 0 ? 'text-green-600' : 'text-gray-600'}`}>
            ${property.profit?.toLocaleString() || '—'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">ROI:</span>
          <span className="ml-1 font-medium">{property.roi || '—'}</span>
        </div>
      </div>

      {/* Stage-specific badges */}
      <div className="mt-2 flex flex-wrap gap-1">
        {property.sourceType && (
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {property.sourceType}
          </span>
        )}
        {property.score && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            property.score >= 80 ? 'bg-green-100 text-green-800' :
            property.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Score: {property.score}
          </span>
        )}
        {property.daysInStage && (
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {property.daysInStage}d
          </span>
        )}
      </div>

      {/* Last Contact / Update */}
      <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
        <span>📅 {property.lastUpdated || 'Today'}</span>
        {getStageActions()}
      </div>
    </div>
  );
};

// Stage Column Component
const StageColumn = ({ title, count, color, properties, onDragStart, onDragEnd, onMove, onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const propertyData = e.dataTransfer.getData('application/json');
    if (propertyData) {
      const property = JSON.parse(propertyData);
      onDrop(property, title.toLowerCase());
    }
  };

  return (
    <div 
      className="bg-gray-50 rounded-lg p-3 min-w-[280px] max-w-[280px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${color}`}></span>
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm font-medium">
          {count}
        </span>
      </div>

      {/* Column Stats */}
      <div className="text-xs text-gray-500 mb-3 flex justify-between">
        <span>Value: ${properties.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}</span>
        <span>Avg: {(properties.reduce((sum, p) => sum + (p.daysInStage || 0), 0) / (properties.length || 1)).toFixed(0)}d</span>
      </div>

      {/* Property Cards */}
      <div className="space-y-2 min-h-[400px]">
        {properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMove={onMove}
          />
        ))}
        
        {/* Empty state */}
        {properties.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm">
            Drop properties here
          </div>
        )}
      </div>

      {/* Add Property Button */}
      <button className="w-full mt-3 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 py-2 rounded border border-dashed border-gray-300 transition">
        + Add Property
      </button>
    </div>
  );
};

export default function PipelinePage() {
  const { user } = useAuth();
  const [draggedProperty, setDraggedProperty] = useState(null);

  // Sample pipeline data
  const [pipelineData, setPipelineData] = useState({
    source: [
      { 
        id: 1, 
        address: "123 Main St", 
        city: "Austin", 
        state: "TX",
        price: 275000,
        sourceType: "Expired Listing",
        score: 92,
        priority: "hot",
        daysInStage: 2,
        lastUpdated: "2h ago"
      },
      { 
        id: 2, 
        address: "456 Oak Ave", 
        city: "Round Rock", 
        state: "TX",
        price: 325000,
        sourceType: "FSBO",
        score: 76,
        priority: "warm",
        daysInStage: 4,
        lastUpdated: "1d ago"
      },
      { 
        id: 3, 
        address: "789 Pine St", 
        city: "Cedar Park", 
        state: "TX",
        price: 295000,
        sourceType: "Probate",
        score: 45,
        priority: "cold",
        daysInStage: 7,
        lastUpdated: "3d ago"
      },
    ],
    screen: [
      { 
        id: 4, 
        address: "321 Elm St", 
        city: "Austin", 
        state: "TX",
        price: 310000,
        arv: 425000,
        profit: 58000,
        roi: "24%",
        score: 82,
        daysInStage: 3,
        lastUpdated: "5h ago"
      },
      { 
        id: 5, 
        address: "654 Maple Ave", 
        city: "Pflugerville", 
        state: "TX",
        price: 289000,
        arv: 385000,
        profit: 42000,
        roi: "18%",
        score: 71,
        daysInStage: 5,
        lastUpdated: "1d ago"
      },
    ],
    analyze: [
      { 
        id: 6, 
        address: "987 Cedar Ln", 
        city: "Austin", 
        state: "TX",
        price: 265000,
        arv: 415000,
        profit: 72000,
        roi: "31%",
        score: 88,
        daysInStage: 2,
        lastUpdated: "3h ago"
      },
      { 
        id: 7, 
        address: "147 Birch St", 
        city: "Georgetown", 
        state: "TX",
        price: 299000,
        arv: 398000,
        profit: 48000,
        roi: "21%",
        score: 75,
        daysInStage: 6,
        lastUpdated: "2d ago"
      },
    ],
    acquire: [
      { 
        id: 8, 
        address: "258 Spruce Ave", 
        city: "Austin", 
        state: "TX",
        price: 285000,
        arv: 435000,
        profit: 65000,
        roi: "27%",
        offerStatus: "Countered",
        daysInStage: 4,
        lastUpdated: "1d ago"
      },
    ],
    renovate: [
      { 
        id: 9, 
        address: "369 Willow Dr", 
        city: "Round Rock", 
        state: "TX",
        price: 250000,
        arv: 410000,
        repairProgress: "60%",
        budgetStatus: "On Track",
        daysInStage: 18,
        lastUpdated: "Today"
      },
    ],
    exit: [
      { 
        id: 10, 
        address: "741 Oakwood Blvd", 
        city: "Austin", 
        state: "TX",
        listPrice: 468000,
        daysOnMarket: 12,
        showings: 8,
        offers: 2,
        daysInStage: 12,
        lastUpdated: "2h ago"
      },
    ],
  });

  // Calculate stage metrics
  const stageMetrics = {
    source: { 
      count: pipelineData.source.length,
      value: pipelineData.source.reduce((sum, p) => sum + (p.price || 0), 0),
      color: "bg-purple-500"
    },
    screen: { 
      count: pipelineData.screen.length,
      value: pipelineData.screen.reduce((sum, p) => sum + (p.price || 0), 0),
      color: "bg-blue-500"
    },
    analyze: { 
      count: pipelineData.analyze.length,
      value: pipelineData.analyze.reduce((sum, p) => sum + (p.price || 0), 0),
      color: "bg-indigo-500"
    },
    acquire: { 
      count: pipelineData.acquire.length,
      value: pipelineData.acquire.reduce((sum, p) => sum + (p.price || 0), 0),
      color: "bg-green-500"
    },
    renovate: { 
      count: pipelineData.renovate.length,
      value: pipelineData.renovate.reduce((sum, p) => sum + (p.price || 0), 0),
      color: "bg-yellow-500"
    },
    exit: { 
      count: pipelineData.exit.length,
      value: pipelineData.exit.reduce((sum, p) => sum + (p.listPrice || 0), 0),
      color: "bg-red-500"
    },
  };

  const totalValue = Object.values(stageMetrics).reduce((sum, stage) => sum + stage.value, 0);
  const totalProperties = Object.values(stageMetrics).reduce((sum, stage) => sum + stage.count, 0);

  // Handle drag start
  const handleDragStart = (e, property) => {
    setDraggedProperty(property);
    e.dataTransfer.setData('application/json', JSON.stringify(property));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedProperty(null);
  };

  // Handle drop (move property between stages)
  const handleDrop = (property, targetStage) => {
    if (!property || property.stage === targetStage) return;

    // Remove from source stage
    const sourceStage = property.stage || getStageFromId(property.id);
    if (!sourceStage) return;

    const updatedData = { ...pipelineData };
    
    // Remove from source
    updatedData[sourceStage] = updatedData[sourceStage].filter(p => p.id !== property.id);
    
    // Add to target with updated stage
    updatedData[targetStage] = [
      ...updatedData[targetStage],
      { ...property, stage: targetStage, daysInStage: 0, lastUpdated: 'Just now' }
    ];
    
    setPipelineData(updatedData);
  };

  // Helper to find which stage a property belongs to
  const getStageFromId = (id) => {
    for (const [stage, properties] of Object.entries(pipelineData)) {
      if (properties.some(p => p.id === id)) return stage;
    }
    return null;
  };

  // Handle move via button
  const handleMove = (propertyId, targetStage) => {
    const sourceStage = getStageFromId(propertyId);
    if (!sourceStage) return;

    const property = pipelineData[sourceStage].find(p => p.id === propertyId);
    handleDrop(property, targetStage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pipeline View</h1>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop properties to move them through the workflow
          </p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>All Properties</option>
            <option>Hot Leads</option>
            <option>My Properties</option>
            <option>At Risk</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            📊 Analytics
          </button>
        </div>
      </div>

      {/* Pipeline Metrics Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-7 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Properties</p>
            <p className="text-xl font-bold">{totalProperties}</p>
          </div>
          <div>
            <p className="text-gray-500">Pipeline Value</p>
            <p className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Avg Days to Exit</p>
            <p className="text-xl font-bold">47</p>
          </div>
          <div>
            <p className="text-gray-500">Conversion Rate</p>
            <p className="text-xl font-bold">24%</p>
          </div>
          <div className="col-span-3">
            <p className="text-gray-500 mb-1">Pipeline Health</p>
            <div className="flex h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{width: `${(stageMetrics.source.count/totalProperties)*100}%`}}></div>
              <div className="bg-blue-500 h-full" style={{width: `${(stageMetrics.screen.count/totalProperties)*100}%`}}></div>
              <div className="bg-indigo-500 h-full" style={{width: `${(stageMetrics.analyze.count/totalProperties)*100}%`}}></div>
              <div className="bg-green-500 h-full" style={{width: `${(stageMetrics.acquire.count/totalProperties)*100}%`}}></div>
              <div className="bg-yellow-500 h-full" style={{width: `${(stageMetrics.renovate.count/totalProperties)*100}%`}}></div>
              <div className="bg-red-500 h-full" style={{width: `${(stageMetrics.exit.count/totalProperties)*100}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-6">
        <StageColumn 
          title="SOURCE"
          count={stageMetrics.source.count}
          color="bg-purple-500"
          properties={pipelineData.source}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
        
        <StageColumn 
          title="SCREEN"
          count={stageMetrics.screen.count}
          color="bg-blue-500"
          properties={pipelineData.screen}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
        
        <StageColumn 
          title="ANALYZE"
          count={stageMetrics.analyze.count}
          color="bg-indigo-500"
          properties={pipelineData.analyze}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
        
        <StageColumn 
          title="ACQUIRE"
          count={stageMetrics.acquire.count}
          color="bg-green-500"
          properties={pipelineData.acquire}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
        
        <StageColumn 
          title="RENOVATE"
          count={stageMetrics.renovate.count}
          color="bg-yellow-500"
          properties={pipelineData.renovate}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
        
        <StageColumn 
          title="EXIT"
          count={stageMetrics.exit.count}
          color="bg-red-500"
          properties={pipelineData.exit}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onDrop={handleDrop}
        />
      </div>

      {/* Conversion Funnel Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4">📈 Conversion Funnel</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Source → Screen</span>
              <span className="font-medium">{(stageMetrics.screen.count / stageMetrics.source.count * 100).toFixed(0)}% (24→12)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Screen → Analyze</span>
              <span className="font-medium">{(stageMetrics.analyze.count / stageMetrics.screen.count * 100).toFixed(0)}% (12→8)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '67%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Analyze → Acquire</span>
              <span className="font-medium">{(stageMetrics.acquire.count / stageMetrics.analyze.count * 100).toFixed(0)}% (8→3)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{width: '38%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Acquire → Renovate</span>
              <span className="font-medium">{(stageMetrics.renovate.count / stageMetrics.acquire.count * 100).toFixed(0)}% (3→2)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '67%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Renovate → Exit</span>
              <span className="font-medium">{(stageMetrics.exit.count / stageMetrics.renovate.count * 100).toFixed(0)}% (2→1)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
          </div>
        </div>

        {/* Bottleneck Alert */}
        {stageMetrics.analyze.count > 5 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <span className="font-semibold">Bottleneck detected:</span> {stageMetrics.analyze.count} properties in Analysis for avg 5 days. Consider reviewing your analysis process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
