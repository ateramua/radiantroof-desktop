import React from "react";

export default function TransactionTable() {
  // To be implemented with actual data
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Property</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="text-center p-4 text-gray-500">
              ⏳ Transaction data pending
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}