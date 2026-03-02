"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
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

// ... (keep all your other component definitions: AICostEstimator, ContractorBid, etc.)

export default function RenovationPage() {
  const { user } = useAuth();
  const [activeProperty, setActiveProperty] = useState("123 Main St");
  const [activeView, setActiveView] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  
  // ✅ ADD THIS LINE - This was missing!
  const [propertyType, setPropertyType] = useState('flip');
  
  // Property details
  const [property, setProperty] = useState({
    address: "123 Main St",
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1985,
    purchasePrice: 275000,
    arv: 425000
  });

  // ... (keep all your task data and other state)

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <option>123 Main St</option>
            <option>456 Oak Ave</option>
            <option>789 Pine St</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Task
          </button>
        </div>
      </div>

      {/* ✅ PROPERTY TYPE SELECTOR - Now works! */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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

      {/* Rest of your component... */}
    </div>
  );
}