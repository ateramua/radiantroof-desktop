"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Tab Component
const Tab = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

// Property Card Component
const PropertyCard = ({ property, onView, onEdit, onConvert }) => {
  const getStatusBadge = () => {
    const statusColors = {
      // Flip statuses
      SOURCE: 'bg-purple-100 text-purple-800',
      SCREENING: 'bg-blue-100 text-blue-800',
      ANALYSIS: 'bg-indigo-100 text-indigo-800',
      ACQUIRED: 'bg-green-100 text-green-800',
      RENOVATING: 'bg-yellow-100 text-yellow-800',
      FOR_SALE: 'bg-orange-100 text-orange-800',
      SOLD: 'bg-gray-100 text-gray-800',
      
      // Rental statuses
      RENOVATING_FOR_RENTAL: 'bg-yellow-100 text-yellow-800',
      READY_FOR_TENANT: 'bg-green-100 text-green-800',
      TENANTED: 'bg-blue-100 text-blue-800',
      VACANT: 'bg-red-100 text-red-800',
      UNDER_REHAB: 'bg-orange-100 text-orange-800',
    };
    
    return statusColors[property.status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{property.address}</h3>
          <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge()}`}>
          {property.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Property Type Badge */}
      <div className="mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          property.type === 'FLIP' ? 'bg-blue-50 text-blue-700' :
          property.type === 'RENTAL' ? 'bg-green-50 text-green-700' :
          'bg-purple-50 text-purple-700'
        }`}>
          {property.type === 'FLIP' ? '🏠 Fix & Flip' : 
           property.type === 'RENTAL' ? '💰 Income Property' : 
           '🔄 BRRRR'}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {property.type === 'FLIP' ? (
          // Flip Metrics
          <>
            <div>
              <p className="text-xs text-gray-400">Purchase Price</p>
              <p className="font-medium">${property.purchasePrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Est. ARV</p>
              <p className="font-medium">${property.arv?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Est. Profit</p>
              <p className="font-medium text-green-600">
                ${(property.arv - property.purchasePrice - (property.renovationBudget || 0)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Renovation</p>
              <p className="font-medium">{property.renovationProgress || 0}%</p>
            </div>
          </>
        ) : (
          // Rental Metrics
          <>
            <div>
              <p className="text-xs text-gray-400">Monthly Rent</p>
              <p className="font-medium">${property.monthlyRent?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Est. Value</p>
              <p className="font-medium">${property.estimatedValue?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Tenants</p>
              <p className="font-medium">{property.tenantCount || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Cash Flow</p>
              <p className={`font-medium ${property.monthlyCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${property.monthlyCashFlow?.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onView(property.id)}
          className="flex-1 text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(property.id)}
          className="flex-1 text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Edit
        </button>
        {property.type === 'FLIP' && property.status === 'FOR_SALE' && (
          <button
            onClick={() => onConvert(property.id, 'RENTAL')}
            className="flex-1 text-sm bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Convert to Rental
          </button>
        )}
      </div>
    </div>
  );
};

// Flip Details Component
const FlipDetails = ({ property, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Renovation Progress</h3>
      <div className="space-y-2">
        {property.renovationTasks?.map(task => (
          <div key={task.id} className="border rounded p-3">
            <div className="flex justify-between">
              <span className="font-medium">{task.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>{task.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <span className="text-gray-500">Estimate:</span>
                <span className="ml-2 font-medium">${task.estimatedCost}</span>
              </div>
              <div>
                <span className="text-gray-500">Actual:</span>
                <span className="ml-2 font-medium">${task.actualCost || '—'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Rental Details Component
const RentalDetails = ({ property, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Tenant Information</h3>
      {property.tenants?.length > 0 ? (
        <div className="space-y-3">
          {property.tenants.map(tenant => (
            <div key={tenant.id} className="border rounded p-3">
              <div className="flex justify-between">
                <span className="font-medium">{tenant.firstName} {tenant.lastName}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2">{tenant.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Rent:</span>
                  <span className="ml-2 font-medium">${tenant.monthlyRent}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Lease: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 border rounded">
          <p className="text-4xl mb-2">🏠</p>
          <p>No tenants yet</p>
          <button className="mt-2 text-sm text-blue-600 hover:underline">
            + Add Tenant
          </button>
        </div>
      )}

      <h3 className="font-semibold mt-6">Monthly Financials</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Rental Income</span>
            <span className="font-medium">${property.monthlyRent}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Mortgage</span>
            <span>-${property.monthlyMortgage}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Property Tax</span>
            <span>-${property.monthlyTax}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Insurance</span>
            <span>-${property.monthlyInsurance}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Management Fee</span>
            <span>-${property.managementFee}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Net Cash Flow</span>
            <span className={property.monthlyCashFlow > 0 ? 'text-green-600' : 'text-red-600'}>
              ${property.monthlyCashFlow}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PropertyManagement({ initialView = 'all' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyType, setPropertyType] = useState('all'); // all, flip, rental
  
  // Sample data - in real app, this would come from API
  const [properties, setProperties] = useState([
    {
      id: 1,
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      type: "FLIP",
      status: "RENOVATING",
      purchasePrice: 275000,
      arv: 425000,
      renovationBudget: 45000,
      renovationProgress: 60,
      renovationTasks: [
        { id: 1, name: "Demo", status: "Completed", estimatedCost: 3500, actualCost: 3200 },
        { id: 2, name: "Electrical", status: "InProgress", estimatedCost: 6500 },
        { id: 3, name: "Plumbing", status: "Pending", estimatedCost: 4800 }
      ]
    },
    {
      id: 2,
      address: "456 Oak Ave",
      city: "Round Rock",
      state: "TX",
      zip: "78664",
      type: "RENTAL",
      status: "TENANTED",
      purchasePrice: 310000,
      estimatedValue: 385000,
      monthlyRent: 2800,
      tenantCount: 1,
      monthlyMortgage: 1450,
      monthlyTax: 350,
      monthlyInsurance: 120,
      managementFee: 224,
      monthlyCashFlow: 656,
      tenants: [
        { 
          id: 1, 
          firstName: "John", 
          lastName: "Smith", 
          phone: "512-555-1234",
          monthlyRent: 2800,
          leaseStart: "2024-01-01",
          leaseEnd: "2024-12-31"
        }
      ]
    },
    {
      id: 3,
      address: "789 Pine St",
      city: "Cedar Park",
      state: "TX",
      zip: "78613",
      type: "FLIP",
      status: "FOR_SALE",
      purchasePrice: 250000,
      arv: 410000,
      renovationBudget: 38000,
      renovationProgress: 100,
      listingPrice: 399000
    },
    {
      id: 4,
      address: "321 Elm St",
      city: "Pflugerville",
      state: "TX",
      zip: "78660",
      type: "RENTAL",
      status: "READY_FOR_TENANT",
      purchasePrice: 265000,
      estimatedValue: 345000,
      monthlyRent: 2400,
      monthlyMortgage: 1250,
      monthlyTax: 320,
      monthlyInsurance: 110,
      managementFee: 192,
      monthlyCashFlow: 528,
      tenants: []
    }
  ]);

  // Filter properties based on active tab
  const filteredProperties = properties.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'flip') return p.type === 'FLIP';
    if (activeTab === 'rental') return p.type === 'RENTAL';
    return true;
  });

  const handleViewProperty = (id) => {
    setSelectedProperty(properties.find(p => p.id === id));
  };

  const handleEditProperty = (id) => {
    router.push(`/admin/properties/${id}/edit`);
  };

  const handleConvertToRental = (id) => {
    // Update property type from FLIP to RENTAL
    setProperties(properties.map(p => 
      p.id === id 
        ? { ...p, type: 'RENTAL', status: 'READY_FOR_TENANT' } 
        : p
    ));
    alert('✅ Property converted to rental! You can now add tenants and track income.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
          <span>➕</span>
          <span>Add Property</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <Tab 
          label="All Properties" 
          icon="🏢" 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')} 
        />
        <Tab 
          label="Fix & Flip" 
          icon="🏠" 
          active={activeTab === 'flip'} 
          onClick={() => setActiveTab('flip')} 
        />
        <Tab 
          label="Rental Properties" 
          icon="💰" 
          active={activeTab === 'rental'} 
          onClick={() => setActiveTab('rental')} 
        />
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="text-2xl font-bold">{properties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Fix & Flip</p>
          <p className="text-2xl font-bold text-blue-600">
            {properties.filter(p => p.type === 'FLIP').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Rentals</p>
          <p className="text-2xl font-bold text-green-600">
            {properties.filter(p => p.type === 'RENTAL').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Monthly Income</p>
          <p className="text-2xl font-bold text-green-600">
            ${properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Property Grid */}
      {selectedProperty ? (
        // Detailed View
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button 
            onClick={() => setSelectedProperty(null)}
            className="text-blue-600 hover:underline mb-4 flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back to all properties</span>
          </button>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Property Info */}
            <div>
              <h2 className="text-2xl font-bold">{selectedProperty.address}</h2>
              <p className="text-gray-500">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Type:</span>
                  <span className="font-medium">
                    {selectedProperty.type === 'FLIP' ? 'Fix & Flip' : 'Rental Property'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedProperty.type === 'FLIP' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedProperty.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purchase Price:</span>
                  <span className="font-medium">${selectedProperty.purchasePrice?.toLocaleString()}</span>
                </div>
                {selectedProperty.type === 'FLIP' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ARV:</span>
                      <span className="font-medium">${selectedProperty.arv?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Est. Profit:</span>
                      <span className="font-medium text-green-600">
                        ${(selectedProperty.arv - selectedProperty.purchasePrice - (selectedProperty.renovationBudget || 0)).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Value:</span>
                      <span className="font-medium">${selectedProperty.estimatedValue?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Rent:</span>
                      <span className="font-medium text-green-600">${selectedProperty.monthlyRent}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Type-specific Details */}
            <div>
              {selectedProperty.type === 'FLIP' ? (
                <FlipDetails property={selectedProperty} />
              ) : (
                <RentalDetails property={selectedProperty} />
              )}
            </div>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
              onConvert={handleConvertToRental}
            />
          ))}
        </div>
      )}
    </div>
  );
}