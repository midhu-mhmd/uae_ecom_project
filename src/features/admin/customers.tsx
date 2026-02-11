import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Filter,
  Star,
  X,
  Phone,
  MapPin,
  RotateCcw,
  Trash2,
  ChevronRight,
  MessageSquare,
  Ban,
  Download,
  Plus,
  ListFilter,
  Calendar,
  Mail,
} from "lucide-react";

/* --- TYPES --- */
type CustomerStatus = "Active" | "Blocked" | "All";
type CustomerTag = "VIP" | "Frequent" | "COD-only" | "New";

interface Address {
  id: string;
  type: "Home" | "Work" | "Other";
  isDefault: boolean;
  line: string;
  city: string;
  pincode: string;
}

interface OrderHistory {
  id: string;
  date: string;
  status: "Delivered" | "Cancelled" | "Processing";
  total: number;
  paymentMethod: "UPI" | "COD" | "Card";
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: Exclude<CustomerStatus, "All">;
  orderCount: number;
  ltv: number;
  avgOrderValue: number;
  last30DaysSpend: number;
  lastOrderDate: string;
  city: string;
  pincode: string;
  createdAt: string;
  tags: CustomerTag[];
  addresses: Address[];
  orders: OrderHistory[];
  internalNotes: string;
}

/* --- MOCK DATA --- */
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "CUS-8801",
    name: "Aditi Rao",
    email: "aditi@example.com",
    phone: "+91 98765 43210",
    status: "Active",
    orderCount: 12,
    ltv: 18450,
    avgOrderValue: 1537,
    last30DaysSpend: 4200,
    lastOrderDate: "Feb 08, 2026",
    city: "Mumbai",
    pincode: "400001",
    createdAt: "Jan 10, 2026",
    tags: ["VIP", "Frequent"],
    internalNotes: "Prefers morning deliveries. Usually buys Tiger Prawns.",
    addresses: [
      {
        id: "a1",
        type: "Home",
        isDefault: true,
        line: "402, Seaface Heights",
        city: "Mumbai",
        pincode: "400001",
      },
    ],
    orders: [
      {
        id: "ORD-9901",
        date: "Feb 08, 2026",
        status: "Delivered",
        total: 1250,
        paymentMethod: "UPI",
      },
    ],
  },
  {
    id: "CUS-8802",
    name: "Vikram Singh",
    email: "v.singh@hmail.com",
    phone: "+91 91234 56789",
    status: "Blocked",
    orderCount: 2,
    ltv: 1200,
    avgOrderValue: 600,
    last30DaysSpend: 0,
    lastOrderDate: "Dec 12, 2025",
    city: "Bangalore",
    pincode: "560001",
    createdAt: "Dec 01, 2025",
    tags: ["COD-only"],
    internalNotes: "Blocked due to repeated COD cancellations.",
    addresses: [
      {
        id: "a3",
        type: "Home",
        isDefault: true,
        line: "House 12, HSR",
        city: "Bangalore",
        pincode: "560102",
      },
    ],
    orders: [
      {
        id: "ORD-7721",
        date: "Dec 12, 2025",
        status: "Delivered",
        total: 1200,
        paymentMethod: "COD",
      },
    ],
  },
];

/* --- MAIN COMPONENT --- */
const CustomerManagement: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  /* --- FILTER STATES --- */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus>("All");
  const [cityFilter, setCityFilter] = useState("");
  const [minOrders, setMinOrders] = useState<number | "">("");

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCityFilter("");
    setMinOrders("");
  };

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesCity = c.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesOrders = minOrders === "" || c.orderCount >= minOrders;
      return matchesSearch && matchesStatus && matchesCity && matchesOrders;
    });
  }, [searchTerm, statusFilter, cityFilter, minOrders]);

  const selectedCustomer = MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId);

  return (
    <div className="min-h-screen w-full px-6 md:px-12 py-8 space-y-6 text-[#18181B] bg-[#FDFDFD]">
      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat label="Total Customers" value="1,240" sub="+12% vs last month" />
        <QuickStat label="Active Now" value="142" sub="Browsing site" />
        <QuickStat label="Blocked" value="18" sub="Safety & Fraud" />
        <QuickStat label="Avg LTV" value="₹4,250" sub="Healthy retention" />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-sm overflow-hidden">
        {/* TABLE TOOLBAR */}
        <div className="p-4 border-b border-[#EEEEEE] flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={14} />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleReset}
              className="p-2 text-[#A1A1AA] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              title="Clear Filters"
            >
              <RotateCcw size={16} />
            </button>
            <div className="h-6 w-px bg-[#EEEEEE] mx-1" />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[11px] font-bold transition-all ${
                isFilterOpen
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-[#EEEEEE] hover:bg-gray-50"
              }`}
            >
              <Filter size={14} /> {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EEEEEE] rounded-lg text-xs font-bold hover:bg-[#FAFAFA] transition-colors">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#FAFAFA]">
              <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest border-b border-[#EEEEEE]">
                <th className="px-6 py-4 w-12 text-center">#</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">LTV Metrics</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>

              {/* FIXED: Added conditional rendering based on isFilterOpen state */}
              {isFilterOpen && (
                <tr className="bg-white border-b border-[#EEEEEE] animate-in fade-in slide-in-from-top-1 duration-200">
                  <td className="px-6 py-3 text-center">
                    <ListFilter size={14} className="text-[#D4D4D8] mx-auto" />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="Filter name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 bg-[#F9F9F9] border border-transparent rounded-md text-[11px] outline-none focus:bg-white focus:border-[#EEEEEE]"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as CustomerStatus)}
                      className="w-full p-2 bg-[#F9F9F9] border border-transparent rounded-md text-[11px] outline-none cursor-pointer focus:bg-white focus:border-[#EEEEEE]"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      placeholder="Min orders"
                      value={minOrders}
                      onChange={(e) => setMinOrders(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full p-2 bg-[#F9F9F9] border border-transparent rounded-md text-[11px] outline-none focus:bg-white focus:border-[#EEEEEE]"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-[10px] text-[#A1A1AA] font-medium italic">Sorting active</div>
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="City..."
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full p-2 bg-[#F9F9F9] border border-transparent rounded-md text-[11px] outline-none focus:bg-white focus:border-[#EEEEEE]"
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={handleReset}
                      className="text-[10px] font-bold text-rose-500 hover:underline px-2"
                    >
                      Clear
                    </button>
                  </td>
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-[#EEEEEE]">
              {filteredCustomers.map((c, index) => (
                <tr key={c.id} className="group hover:bg-[#FBFBFA] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-[#A1A1AA] text-center">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold border border-[#EEEEEE]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-1.5">
                          {c.name}
                          {c.tags.includes("VIP") && (
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                          )}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        c.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold">{c.orderCount}</span>
                      <div className="flex-1 h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden max-w-[60px]">
                        <div
                          className="h-full bg-black rounded-full"
                          style={{ width: `${Math.min(c.orderCount * 8, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">₹{c.ltv.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Avg: ₹{c.avgOrderValue}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <MapPin size={10} className="text-[#A1A1AA]" /> {c.city}
                    </div>
                    <p className="text-[#A1A1AA] text-[10px] mt-0.5">{c.pincode}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomerId(c.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#71717A] hover:text-black hover:bg-[#F4F4F5] rounded-lg transition-all"
                    >
                      View Profile <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <Search className="mx-auto text-[#D4D4D8]" size={32} />
              <p className="text-sm font-bold text-[#18181B]">No matching results</p>
              <button
                onClick={handleReset}
                className="text-xs font-bold underline text-[#A1A1AA] hover:text-black"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-2 text-[11px] text-[#A1A1AA] font-medium italic">
        <p>Showing {filteredCustomers.length} of {MOCK_CUSTOMERS.length} records</p>
        <p>Database updated: Just now</p>
      </div>

      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const CustomerDetailPanel = ({ customer, onClose }: { customer: Customer; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-[#FAFAFA]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {customer.name}{" "}
                {customer.tags.includes("VIP") && (
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                )}
              </h2>
              <p className="text-[11px] text-[#71717A]">
                {customer.email} • ID: {customer.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex px-6 border-b">
          {["profile", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab ? "border-black text-black" : "border-transparent text-[#A1A1AA]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <InfoBox label="Phone" value={customer.phone} icon={<Phone size={14} />} />
                <InfoBox label="Location" value={customer.city} icon={<MapPin size={14} />} />
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-[#A1A1AA] tracking-widest">
                  Internal Notes
                </h4>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs italic text-amber-900">
                  "{customer.internalNotes}"
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {customer.orders.map((o) => (
                <div key={o.id} className="p-4 border border-[#EEEEEE] rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold font-mono">{o.id}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-1">
                      {o.date} • {o.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{o.total}</p>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-[#FAFAFA] flex gap-3">
          <button className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#222] flex items-center justify-center gap-2 transition-all">
            <MessageSquare size={14} /> Send Message
          </button>
          <button className="px-4 py-3 bg-white border border-rose-100 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all">
            <Ban size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

const QuickStat = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="p-5 bg-white border border-[#EEEEEE] rounded-2xl shadow-sm hover:border-[#D4D4D8] transition-colors">
    <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
    <p className="text-[11px] text-emerald-600 font-medium mt-1">{sub}</p>
  </div>
);

const InfoBox = ({ label, value, icon }: { label: string; value: string; icon: any }) => (
  <div className="p-4 border border-[#EEEEEE] rounded-xl space-y-1.5 bg-[#FDFDFD]">
    <div className="flex items-center gap-2 text-[#A1A1AA]">
      {icon} <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

export default CustomerManagement;