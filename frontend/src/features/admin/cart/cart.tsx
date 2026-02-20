import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RefreshCcw,
  Mail,
  MousePointer2,
  Trash2,
  Filter,
  Download
} from "lucide-react";
import {
  adminCartsActions,
  selectAdminCarts,
  selectAdminCartsStatus,
  selectAdminCartsError
} from "./cartSlice";

/* --- HELPER FUNCTIONS --- */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR", // Changed to INR as per context, or keep USD? User mock had $ but context implies INR. I'll use INR.
  }).format(amount);
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const getStatus = (updatedAt: string): "Active" | "Abandoned" => {
  const date = new Date(updatedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffInHours < 1 ? "Active" : "Abandoned"; // 1 hour threshold
};

/* --- COMPONENT --- */
const CartManagement: React.FC = () => {
  const dispatch = useDispatch();
  const carts = useSelector(selectAdminCarts);
  const status = useSelector(selectAdminCartsStatus);
  const error = useSelector(selectAdminCartsError);

  useEffect(() => {
    dispatch(adminCartsActions.fetchCartsRequest({}));
  }, [dispatch]);

  const handleSync = () => {
    dispatch(adminCartsActions.fetchCartsRequest({}));
  };

  /* --- STATS CALCULATION --- */
  const stats = useMemo(() => {
    const total = carts.length;
    if (total === 0) return { active: 0, abandonedRate: "0%", recoveryPotential: formatCurrency(0) };

    const activeCount = carts.filter(c => getStatus(c.updatedAt) === "Active").length;
    const abandonedCarts = carts.filter(c => getStatus(c.updatedAt) === "Abandoned");
    const abandonedCount = abandonedCarts.length;
    const abandonedTotalValue = abandonedCarts.reduce((acc, c) => acc + c.totalPrice, 0);

    return {
      active: activeCount,
      abandonedRate: `${((abandonedCount / total) * 100).toFixed(1)}%`,
      recoveryPotential: formatCurrency(abandonedTotalValue),
    };
  }, [carts]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
            Cart Management
          </h1>
          <p className="text-[#71717A] text-sm mt-1">
            Monitor intent and recover sessions.
          </p>
        </div>
        <button
          onClick={handleSync}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md text-xs font-bold hover:bg-[#222] transition-all"
        >
          <RefreshCcw size={14} className={status === "loading" ? "animate-spin" : ""} /> Sync Live Data
        </button>
      </section>

      {/* Grid: 1 col on mobile, 3 on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Active Carts", value: stats.active.toString(), detail: "Real-time sessions" },
          { label: "Abandoned Rate", value: stats.abandonedRate, detail: "Based on 1hr inactivity" },
          { label: "Recovery Potential", value: stats.recoveryPotential, detail: "In abandoned items" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 md:p-6 border border-[#EEEEEE] rounded-xl hover:border-black transition-all group bg-[#FAFAFA]/50"
          >
            <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest group-hover:text-black">
              {stat.label}
            </p>
            <h3 className="text-xl md:text-2xl font-bold mt-1 tracking-tight">
              {stat.value}
            </h3>
            <p className="text-[11px] text-[#71717A] mt-1">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[#EEEEEE] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest">
            Session Activity
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none text-[10px] font-bold border border-[#E5E5E5] px-3 py-1.5 rounded hover:bg-[#FAFAFA] flex items-center justify-center gap-2">
              <Filter size={12} /> Filter
            </button>
            <button className="flex-1 md:flex-none text-[10px] font-bold border border-[#E5E5E5] px-3 py-1.5 rounded hover:bg-[#FAFAFA] flex items-center justify-center gap-2">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* Table wrapper for horizontal scroll on small screens */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">
                <th className="px-6 py-4 border-b border-[#EEEEEE]">Cart ID</th>
                <th className="px-6 py-4 border-b border-[#EEEEEE]">Customer</th>
                <th className="px-6 py-4 border-b border-[#EEEEEE]">Items</th>
                <th className="px-6 py-4 border-b border-[#EEEEEE]">Total</th>
                <th className="px-6 py-4 border-b border-[#EEEEEE]">Status</th>
                <th className="px-6 py-4 border-b border-[#EEEEEE] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {status === "loading" && carts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Loading carts...</td>
                </tr>
              ) : carts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">No carts found.</td>
                </tr>
              ) : (
                carts.map((cart) => {
                  const cartStatus = getStatus(cart.updatedAt);
                  return (
                    <tr
                      key={cart.id}
                      className="group hover:bg-[#FBFBFA] transition-colors"
                    >
                      <td className="px-6 py-5 font-mono text-xs text-[#71717A]">
                        CRT-{cart.id}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold leading-none">
                          User #{cart.userId || "Guest"}
                        </p>
                        <p className="text-[10px] text-[#A1A1AA] mt-1.5">
                          {formatTimeAgo(cart.updatedAt)}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        {cart.totalItems} Units
                      </td>
                      <td className="px-6 py-5 text-sm font-bold">
                        {formatCurrency(cart.totalPrice)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cartStatus === "Active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                        >
                          {cartStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-black hover:text-white rounded-md transition-colors">
                            <Mail size={14} />
                          </button>
                          <button className="p-2 hover:bg-black hover:text-white rounded-md transition-colors">
                            <MousePointer2 size={14} />
                          </button>
                          <button className="p-2 hover:text-rose-600 rounded-md transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CartManagement;