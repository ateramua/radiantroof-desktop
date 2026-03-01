// components/RiskMeter.jsx
export default function RiskMeter({ riskLevel }) {
  const riskConfig = {
    low: {
      color: 'bg-green-500',
      text: 'Low Risk',
      message: 'Strong metrics across all categories',
      width: '33%'
    },
    moderate: {
      color: 'bg-yellow-500',
      text: 'Moderate Risk',
      message: 'Review DSCR and cash flow buffers',
      width: '66%'
    },
    high: {
      color: 'bg-red-500',
      text: 'High Risk',
      message: 'Proceed with caution - multiple red flags',
      width: '100%'
    }
  };

  const config = riskConfig[riskLevel];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          riskLevel === 'low' ? 'bg-green-100 text-green-800' :
          riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {config.text}
        </span>
      </div>
      
      {/* Risk Meter Bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full ${config.color} transition-all duration-500`}
          style={{ width: config.width }}
        />
      </div>
      
      <p className="text-sm text-gray-600">{config.message}</p>
      
      {/* Risk Factors */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-900">DSCR</div>
          <div className={riskLevel === 'low' ? 'text-green-600' : 'text-yellow-600'}>
            {riskLevel === 'low' ? '1.28 ✓' : '1.06 ⚠'}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-900">Cash Flow</div>
          <div className="text-green-600">$238 ✓</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-900">Margin</div>
          <div className="text-green-600">15% ✓</div>
        </div>
      </div>
    </div>
  );
}