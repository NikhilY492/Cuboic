export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Today's Sales</h3>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-500">0</p>
        </div>
      </div>
    </div>
  )
}
