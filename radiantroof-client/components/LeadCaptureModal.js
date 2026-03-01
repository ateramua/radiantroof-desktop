'use client';
// components/LeadCaptureModal.jsx
export default function LeadCaptureModal({ isOpen, onClose, dealData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get Your Full Underwriting Report
          </h3>
          <p className="text-gray-600">
            We'll send you a complete PDF report with all calculations and recommendations.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Fix & Flip Investor</option>
              <option>Buy & Hold Investor</option>
              <option>Passive Investor</option>
              <option>Private Lender</option>
              <option>Just Looking</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600"
          >
            Send Me The Report →
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            We'll never share your information. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}