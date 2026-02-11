import React from "react";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const stats = [
    { label: "Active Inventory", value: "250", change: "+2.5%", trend: "up", icon: <Package size={18} strokeWidth={1.5} /> },
    { label: "Orders Completed", value: "124", change: "+12%", trend: "up", icon: <CheckCircle2 size={18} strokeWidth={1.5} /> },
    { label: "Canceled Orders", value: "14", change: "-1.5%", trend: "down", icon: <AlertCircle size={18} strokeWidth={1.5} /> },
    { label: "Store Ranking", value: "#12", change: "Top 5%", trend: "up", icon: <Trophy size={18} strokeWidth={1.5} /> },
  ];

  const recentOrders = [
    { id: "ORD-7721", item: "Premium Cotton Tee", date: "Feb 10", price: "$59.00", status: "Completed" },
    { id: "ORD-7722", item: "Workwear Chinos", date: "Feb 10", price: "$124.50", status: "Processing" },
    { id: "ORD-7723", item: "Linen Overshirt", date: "Feb 09", price: "$85.00", status: "Completed" },
  ];

  return (
    <div className="min-h-screen text-[#121212] font-sans pb-12 px-4 sm:px-6 lg:px-10 pt-8">
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#EEEEEE] transition-all hover:shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[#71717A]">{stat.icon}</div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                {stat.trend === "up" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (WIDER - 9/12) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* COMPACT CHART */}
          <div className="bg-white rounded-xl border border-[#EEEEEE] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-xs uppercase tracking-widest">Customer Activity</h2>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5D5FEF]" /><span className="text-[10px] font-bold text-gray-400">Checkout</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FFB340]" /><span className="text-[10px] font-bold text-gray-400">Paid</span></div>
                </div>
                <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Reduced height from 64 to 48 */}
            <div className="h-48 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 font-bold h-[80%] pointer-events-none">
                <span>4k</span><span>2k</span><span>0</span>
              </div>

              <div className="ml-8 h-full relative">
                <div className="absolute inset-0 flex flex-col justify-between h-[80%] pt-1 pointer-events-none opacity-40">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-gray-200" />)}
                </div>

                <svg className="w-full h-full pt-2 pb-8 overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <path d="M0,80 C150,75 300,85 500,60 C700,40 850,55 1000,45" fill="none" stroke="#FFB340" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M0,60 C150,55 300,40 500,45 C700,20 850,15 1000,5" fill="none" stroke="#5D5FEF" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="700" cy="20" r="3" fill="white" stroke="#121212" strokeWidth="2" />
                </svg>

                <div className="flex justify-between absolute bottom-0 w-full text-[9px] text-gray-400 font-bold uppercase">
                  {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* WIDER RECENT ORDERS */}
          <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#EEEEEE] bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Recent Transactions</h2>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase bg-white">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Item Name</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Price</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F4F5]">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="text-xs hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-4 font-mono text-[10px] text-[#71717A]">{order.id}</td>
                      <td className="px-5 py-4 font-bold">{order.item}</td>
                      <td className="px-5 py-4 text-[#A1A1AA]">{order.date}</td>
                      <td className="px-5 py-4 font-bold text-right">{order.price}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${order.status === "Completed" ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-amber-100 text-amber-600 bg-amber-50"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SMALLER - 3/12) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-rose-100 p-5 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-4 text-rose-600">
              <AlertCircle size={14} />
              <h2 className="text-[10px] font-bold uppercase tracking-widest">Low Stock</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Crop Top Pants", stock: 2 },
                { name: "Canvas Tote Bag", stock: 0 },
                { name: "Linen Shirt", stock: 5 },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1 pb-2 border-b border-gray-50 last:border-0">
                  <p className="text-[11px] font-bold truncate">{item.name}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.stock === 0 ? "bg-rose-100 text-rose-700" : "bg-orange-50 text-orange-600"}`}>
                      {item.stock === 0 ? "Out of Stock" : `${item.stock} in stock`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
              Inventory Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;