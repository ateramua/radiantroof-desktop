// Add this at the very top of the file
console.log('🔴🔴🔴 ADMIN PAGE IS LOADING 🔴🔴🔴');
export default function AdminDashboard() {
    console.log('🟢🟢🟢 ADMIN DASHBOARD COMPONENT RENDERING 🟢🟢🟢');
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Properties</h3>
          <p className="text-xl">⏳</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Users</h3>
          <p className="text-xl">⏳</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Active Deals</h3>
          <p className="text-xl">⏳</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Revenue</h3>
          <p className="text-xl">⏳</p>
        </div>
      </div>
    </div>
  );
}