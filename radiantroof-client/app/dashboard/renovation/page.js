{/* Property Type Selector */}
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