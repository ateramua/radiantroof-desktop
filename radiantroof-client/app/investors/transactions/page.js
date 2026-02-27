import React from "react";
import TransactionTable from "@/components/TransactionTable";

export default function TransactionsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <TransactionTable />
    </div>
  );
}