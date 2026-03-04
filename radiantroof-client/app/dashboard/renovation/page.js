"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useDeal } from "../../../context/DealContext";
import Link from "next/link";

// Task Card Component
const TaskCard = ({ task, onUpdate, onBid }) => (
  <div className={`border rounded-lg p-4 ${
    task.status === 'completed' ? 'bg-green-50 border-green-200' :
    task.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
    task.status === 'bid-awarded' ? 'bg-purple-50 border-purple-200' :
    'bg-white'
  }`}>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold">{task.name}</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {task.priority}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        
        {/* Task Details Grid */}
        <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
          <div>
            <p className="text-gray-500">Estimate</p>
            <p className="font-medium">${task.estimatedCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Lowest Bid</p>
            <p className="font-medium text-green-600">
              {task.lowestBid ? `$${task.lowestBid.toLocaleString()}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Bids</p>
            <p className="font-medium">{task.bidCount || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Duration</p>
            <p className="font-medium">{task.duration} days</p>
          </div>
        </div>
      </div>
      
      {/* Status Badge & Actions */}
      <div className="ml-4 text-right">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          task.status === 'completed' ? 'bg-green-200 text-green-800' :
          task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
          task.status === 'bid-awarded' ? 'bg-purple-200 text-purple-800' :
          task.status === 'bidding' ? 'bg-yellow-200 text-yellow-800' :
          'bg-gray-200 text-gray-800'
        }`}>
          {task.status.replace('-', ' ')}
        </span>
        
        {task.status === 'pending' && (
          <button
            onClick={() => onBid(task.id)}
            className="mt-2 block w-full bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Start Bidding
          </button>
        )}
        
        {task.status === 'bid-awarded' && (
          <button
            onClick={() => onUpdate(task.id, 'in-progress')}
            className="mt-2 block w-full bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
          >
            Start Work
          </button>
        )}
        
        {task.status === 'in-progress' && (
          <button
            onClick={() => onUpdate(task.id, 'completed')}
            className="mt-2 block w-full bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
    
    {/* Progress Bar for In-Progress Tasks */}
    {task.status === 'in-progress' && task.progress !== undefined && (
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

// Budget Tracker Component
const BudgetTracker = ({ totalBudget, spent, remaining, tasksByStatus }) => {
  const percentSpent = (spent / totalBudget * 100).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">💰 Budget Tracker</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Budget:</span>
          <span className="text-xl font-bold text-blue-600">${totalBudget.toLocaleString()}</span>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Spent: ${spent.toLocaleString()}</span>
            <span>Remaining: ${remaining.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                percentSpent > 90 ? 'bg-red-500' : 
                percentSpent > 75 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-yellow-50 p-2 rounded">
            <p className="text-gray-500">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{tasksByStatus.pending}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-500">In Progress</p>
            <p className="text-xl font-bold text-blue-600">{tasksByStatus.inProgress}</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-gray-500">Completed</p>
            <p className="text-xl font-bold text-green-600">{tasksByStatus.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Phase Timeline Component
const PhaseTimeline = ({ phases }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold mb-4">📅 Phase Timeline</h3>
    <div className="space-y-3">
      {phases.map((phase, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{phase.name}</span>
            <span className="text-gray-500">{phase.duration}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${phase.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Helper function to calculate spent amount
const calculateSpent = (repairData) => {
  const majorSystemsSpent = Object.values(repairData.majorSystems || {}).reduce((sum, item) => 
    sum + (item.status === 'completed' ? item.cost : 0), 0);
  const roomsSpent = Object.values(repairData.rooms || {}).reduce((sum, item) => 
    sum + (item.status === 'completed' ? item.cost : 0), 0);
  return majorSystemsSpent + roomsSpent;
};

export default function RenovationPage() {
  const { user } = useAuth();
  const { currentDeal, updateDeal } = useDeal();
  const [activeProperty, setActiveProperty] = useState("123 Main St");
  const [activeView, setActiveView] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [propertyType, setPropertyType] = useState('flip');
  
  // Load repair data from context
  const [repairData, setRepairData] = useState({
    majorSystems: {},
    rooms: {},
    contingencyPercent: 15,
    totalBudget: 0,
    spent: 0
  });

  // Load data from currentDeal when available
  useEffect(() => {
    if (currentDeal?.repairEstimate) {
      // Add status tracking to each task
      const majorSystemsWithStatus = {};
      const roomsWithStatus = {};
      
      Object.entries(currentDeal.repairEstimate.majorSystems || {}).forEach(([key, value]) => {
        majorSystemsWithStatus[key] = {
          ...value,
          status: value.status || 'pending',
          bids: value.bids || [],
          awardedBid: value.awardedBid || null
        };
      });
      
      Object.entries(currentDeal.repairEstimate.rooms || {}).forEach(([key, value]) => {
        roomsWithStatus[key] = {
          ...value,
          status: value.status || 'pending',
          bids: value.bids || [],
          awardedBid: value.awardedBid || null
        };
      });
      
      // If there's existing renovation progress, use it
      if (currentDeal.renovationProgress) {
        setRepairData(currentDeal.renovationProgress);
      } else {
        const newRepairData = {
          majorSystems: majorSystemsWithStatus,
          rooms: roomsWithStatus,
          contingencyPercent: currentDeal.repairEstimate.contingencyPercent || 15,
          totalBudget: 0,
          spent: 0
        };
        setRepairData(newRepairData);
      }

      // Set property address
      if (currentDeal.address) {
        setActiveProperty(currentDeal.address);
      }
    }
  }, [currentDeal]);

  // Calculate totals whenever repairData changes
  useEffect(() => {
    if (Object.keys(repairData.majorSystems).length > 0 || Object.keys(repairData.rooms).length > 0) {
      const majorSystemsTotal = Object.values(repairData.majorSystems).reduce((sum, item) => sum + (item.cost || 0), 0);
      const roomsTotal = Object.values(repairData.rooms).reduce((sum, item) => sum + (item.cost || 0), 0);
      const baseTotal = majorSystemsTotal + roomsTotal;
      const totalWithContingency = baseTotal * (1 + (repairData.contingencyPercent || 15) / 100);
      
      const spent = calculateSpent(repairData);
      
      setRepairData(prev => ({
        ...prev,
        totalBudget: totalWithContingency,
        spent: spent
      }));
    }
  }, [repairData.majorSystems, repairData.rooms, repairData.contingencyPercent]);

  // Calculate current values
  const totalBudget = repairData.totalBudget || 0;
  const spent = repairData.spent || 0;
  const remaining = totalBudget - spent;
  const baseTotal = totalBudget / (1 + (repairData.contingencyPercent || 15) / 100);

  // Task status counts
  const tasksByStatus = {
    pending: Object.values(repairData.majorSystems).filter(t => t.status === 'pending').length +
             Object.values(repairData.rooms).filter(t => t.status === 'pending').length,
    inProgress: Object.values(repairData.majorSystems).filter(t => t.status === 'in-progress').length +
                Object.values(repairData.rooms).filter(t => t.status === 'in-progress').length,
    completed: Object.values(repairData.majorSystems).filter(t => t.status === 'completed').length +
               Object.values(repairData.rooms).filter(t => t.status === 'completed').length
  };

  // Phase timeline
  const phases = [
    { name: "Demolition", duration: "Week 1-2", progress: 100 },
    { name: "Major Systems", duration: "Week 2-4", progress: 60 },
    { name: "Interior Finishes", duration: "Week 3-6", progress: 30 },
    { name: "Final Touches", duration: "Week 6-8", progress: 0 }
  ];

  // Update task status and sync with context
  const updateTaskStatus = (category, taskId, newStatus) => {
    setRepairData(prev => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          [taskId]: {
            ...prev[category][taskId],
            status: newStatus
          }
        }
      };
      
      // Update spent amount
      const spent = calculateSpent(updated);
      updated.spent = spent;
      
      // Sync with global context
      updateDeal({
        renovationProgress: {
          ...updated,
          lastUpdated: new Date().toISOString()
        }
      });
      
      return updated;
    });
  };

  // Start bidding for a task
  const startBidding = (category, taskId) => {
    setSelectedTask({ 
      category, 
      taskId, 
      ...repairData[category][taskId],
      name: category === 'majorSystems' 
        ? taskId.charAt(0).toUpperCase() + taskId.slice(1)
        : taskId.replace(/([A-Z])/g, ' $1').trim()
    });
    setShowBidModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Pipeline Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Renovation War Room</h1>
          <p className="text-sm text-gray-500 mt-1">
            Plan, bid, and track your renovation projects
          </p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={activeProperty}
            onChange={(e) => setActiveProperty(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option>{activeProperty}</option>
          </select>
          <Link href="/dashboard/exit">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              → Go to Exit
            </button>
          </Link>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <div className="w-16 h-1 bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <div className="w-16 h-1 bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <div className="w-16 h-1 bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div className="w-16 h-1 bg-gray-300"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">5</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium text-blue-600">Renovation</span> • Phase 4 of 5
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-green-600">✓ Sourcing</span>
          <span className="text-green-600">✓ Screening</span>
          <span className="text-green-600">✓ Analysis</span>
          <span className="text-blue-600 font-medium">● Renovation</span>
          <span className="text-gray-400">Exit</span>
        </div>
      </div>

      {/* Property Type Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium">Property Type:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setPropertyType('flip')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  propertyType === 'flip' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Fix & Flip
              </button>
              <button
                onClick={() => setPropertyType('rental')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  propertyType === 'rental' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💰 Rental Rehab
              </button>
            </div>
          </div>
          
          {propertyType === 'rental' && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              ⭐ Improvements are depreciable assets
            </div>
          )}
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Base: ${Math.round(baseTotal).toLocaleString()} + {repairData.contingencyPercent}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Spent to Date</p>
          <p className="text-2xl font-bold text-orange-600">${spent.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{totalBudget > 0 ? ((spent/totalBudget)*100).toFixed(1) : 0}% of budget</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-2xl font-bold text-green-600">${remaining.toLocaleString()}</p>
          <p className="text-xs text-gray-400">${(remaining/(tasksByStatus.pending || 1)).toFixed(0)} per pending task</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Project Status</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalBudget > 0 ? Math.round((spent/totalBudget)*100) : 0}%
          </p>
          <p className="text-xs text-gray-400">Overall completion</p>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Tasks (2/3 width) */}
        <div className="col-span-2 space-y-6">
          {/* View Toggle */}
          <div className="bg-white rounded-lg shadow-sm p-2 inline-flex">
            <button
              onClick={() => setActiveView('tasks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeView === 'tasks' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Task View
            </button>
            <button
              onClick={() => setActiveView('rooms')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeView === 'rooms' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏠 Room View
            </button>
            <button
              onClick={() => setActiveView('systems')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeView === 'systems' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🔧 Systems View
            </button>
          </div>

          {/* Task View */}
          {activeView === 'tasks' && (
            <div className="space-y-4">
              {/* Major Systems Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">🔧 Major Systems</h3>
                <div className="space-y-3">
                  {Object.entries(repairData.majorSystems).map(([key, task]) => (
                    task.cost > 0 && (
                      <TaskCard
                        key={key}
                        task={{
                          id: key,
                          name: key.charAt(0).toUpperCase() + key.slice(1),
                          description: `${task.condition} condition - ${task.cost > 0 ? 'Needs work' : 'OK'}`,
                          estimatedCost: task.cost,
                          lowestBid: task.awardedBid,
                          bidCount: task.bids.length,
                          duration: key === 'roof' ? 5 : key === 'electrical' ? 4 : 3,
                          priority: task.cost > 10000 ? 'high' : task.cost > 5000 ? 'medium' : 'low',
                          status: task.status,
                          progress: task.status === 'in-progress' ? 50 : undefined
                        }}
                        onUpdate={(id, status) => updateTaskStatus('majorSystems', key, status)}
                        onBid={() => startBidding('majorSystems', key)}
                      />
                    )
                  ))}
                </div>
              </div>

              {/* Room Finishes Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">🏠 Room Finishes</h3>
                <div className="space-y-3">
                  {Object.entries(repairData.rooms).map(([key, task]) => (
                    task.cost > 0 && (
                      <TaskCard
                        key={key}
                        task={{
                          id: key,
                          name: key.replace(/([A-Z])/g, ' $1').trim(),
                          description: `${task.condition} - Complete renovation needed`,
                          estimatedCost: task.cost,
                          lowestBid: task.awardedBid,
                          bidCount: task.bids.length,
                          duration: key === 'kitchen' ? 14 : key.includes('bath') ? 7 : 5,
                          priority: task.cost > 15000 ? 'high' : task.cost > 8000 ? 'medium' : 'low',
                          status: task.status,
                          progress: task.status === 'in-progress' ? 30 : undefined
                        }}
                        onUpdate={(id, status) => updateTaskStatus('rooms', key, status)}
                        onBid={() => startBidding('rooms', key)}
                      />
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Room View */}
          {activeView === 'rooms' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">🏠 Room-by-Room Status</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(repairData.rooms).map(([room, data]) => (
                  <div key={room} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        data.status === 'completed' ? 'bg-green-100 text-green-800' :
                        data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        data.status === 'bidding' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {data.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Work: {data.condition}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">${data.cost.toLocaleString()}</span>
                    </div>
                    {data.status === 'pending' && (
                      <button
                        onClick={() => startBidding('rooms', room)}
                        className="w-full mt-3 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
                      >
                        Start Bidding
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems View */}
          {activeView === 'systems' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">🔧 Systems Status</h3>
              <div className="space-y-4">
                {Object.entries(repairData.majorSystems).map(([system, data]) => (
                  <div key={system} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold capitalize">{system}</h4>
                        <p className="text-sm text-gray-500">Condition: {data.condition}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          data.status === 'completed' ? 'bg-green-100 text-green-800' :
                          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {data.status}
                        </span>
                        <p className="text-sm font-medium mt-1">${data.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Tracking (1/3 width) */}
        <div className="space-y-6">
          {/* Budget Tracker */}
          <BudgetTracker 
            totalBudget={totalBudget}
            spent={spent}
            remaining={remaining}
            tasksByStatus={tasksByStatus}
          />

          {/* Phase Timeline */}
          <PhaseTimeline phases={phases} />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                📸 Upload Progress Photos
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                📋 Request Inspections
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                💰 Schedule Draw Payment
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                📊 Generate Status Report
              </button>
            </div>
          </div>

          {/* Material Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">📦 Material Orders</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Kitchen Cabinets</span>
                <span className="text-green-600">Delivered</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Bathroom Tiles</span>
                <span className="text-yellow-600">Shipping</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>HVAC Unit</span>
                <span className="text-blue-600">Ordered</span>
              </div>
              <button className="w-full text-blue-600 text-sm hover:underline mt-2">
                Track All Orders →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Get Bids for {selectedTask.name}</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Estimated Cost</p>
                <p className="text-xl font-bold">${selectedTask.estimatedCost.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Invite Contractors</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Mike's Contracting (4.8★) - $12,500</option>
                  <option>ABC Builders (4.5★) - $13,200</option>
                  <option>Quality Crafts (5.0★) - $14,000</option>
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Award bid logic here
                    setShowBidModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Send Invites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}