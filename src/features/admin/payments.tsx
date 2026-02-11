import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Wallet, Banknote, Landmark, RefreshCcw, 
  Search, Filter, Download, ChevronRight, X, CheckCircle2, 
  AlertCircle, Clock, ArrowUpRight, ArrowDownRight, 
  Receipt, FileText, User, ShieldCheck, History,
  LayoutDashboard, ListOrdered, Undo2, HandCoins, Gavel, BarChart3
} from 'lucide-react';

/* --- TYPES --- */
type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'PARTIAL_REFUND';
type PaymentMethod = 'UPI' | 'CARD' | 'NB' | 'WALLET' | 'COD';
type ViewType = 'dashboard' | 'payments' | 'refunds' | 'settlements' | 'cod' | 'disputes';

interface Payment {
  id: string;
  orderId: string;
  customer: { name: string; phone: string };
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

/* --- MOCK DATA --- */
const MOCK_PAYMENTS: Payment[] = [
  { id: "PAY-8820", date: "10 Feb, 14:22", orderId: "#ORD-5541", customer: { name: "Aditi Rao", phone: "98200..." }, amount: 1450, method: "UPI", status: "SUCCESS" },
  { id: "PAY-8819", date: "10 Feb, 13:05", orderId: "#ORD-5538", customer: { name: "Rahul D.", phone: "98201..." }, amount: 2100, method: "COD", status: "PENDING" },
  { id: "PAY-8818", date: "10 Feb, 12:45", orderId: "#ORD-5532", customer: { name: "Vikram S.", phone: "98202..." }, amount: 850, method: "CARD", status: "FAILED" },
  { id: "PAY-8817", date: "10 Feb, 11:30", orderId: "#ORD-5530", customer: { name: "Sanya M.", phone: "98203..." }, amount: 3200, method: "UPI", status: "SUCCESS" },
];

/* --- MAIN COMPONENT --- */
const PaymentManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('payments');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 py-8 space-y-6 text-[#18181B] font-sans antialiased animate-in fade-in duration-700">
      
      {/* --- TOP NAVIGATION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-0">
        <nav className="flex items-center gap-1 bg-white p-1.5 border border-[#EEEEEE] rounded-2xl w-fit shadow-sm overflow-x-auto no-scrollbar">
          <NavTab id="dashboard" active={currentView} label="Overview" icon={<LayoutDashboard size={14}/>} onClick={setCurrentView} />
          <NavTab id="payments" active={currentView} label="Payments" icon={<ListOrdered size={14}/>} onClick={setCurrentView} />
          <NavTab id="refunds" active={currentView} label="Refunds" icon={<Undo2 size={14}/>} onClick={setCurrentView} />
          <NavTab id="cod" active={currentView} label="COD" icon={<HandCoins size={14}/>} onClick={setCurrentView} />
          <NavTab id="settlements" active={currentView} label="Settlements" icon={<Landmark size={14}/>} onClick={setCurrentView} />
          <NavTab id="disputes" active={currentView} label="Disputes" icon={<ShieldCheck size={14}/>} onClick={setCurrentView} />
        </nav>
      </div>

      {/* --- RENDER VIEWS --- */}
      <main className="min-h-[60vh]">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'payments' && <PaymentsListView onSelect={setSelectedPaymentId} />}
        {currentView === 'refunds' && <RefundsView />}
        {currentView === 'cod' && <CODView />}
        {currentView === 'settlements' && <SettlementsView />}
        {currentView === 'disputes' && <DisputesView />}
      </main>

      {/* --- PAYMENT DETAIL DRAWER --- */}
      {selectedPaymentId && (
        <PaymentDetailDrawer 
          id={selectedPaymentId} 
          onClose={() => setSelectedPaymentId(null)} 
        />
      )}
    </div>
  );
};

/* --- 1. DASHBOARD VIEW --- */
const DashboardView = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Collected" value="₹4,28,450" trend="+12.5%" trendType="up" sub="This Month" />
      <StatCard label="Success Rate" value="98.2%" trend="+0.4%" trendType="up" sub="Gateway health" />
      <StatCard label="Pending COD" value="₹12,200" trend="-5.1%" trendType="down" sub="Collection due" />
      <StatCard label="Refunded" value="₹4,120" trend="+2.1%" trendType="up" sub="Total 8 refunds" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-[#EEEEEE] rounded-2xl p-6 h-64 flex flex-col justify-center items-center text-gray-400 shadow-sm">
          <BarChart3 size={40} className="mb-2 opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Revenue Flow Visualization</p>
      </div>
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 h-64 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-4">Method Split</h4>
        <div className="space-y-4">
          <MethodBar label="UPI" percentage={65} color="bg-emerald-500" />
          <MethodBar label="Card" percentage={20} color="bg-blue-500" />
          <MethodBar label="COD" percentage={12} color="bg-amber-500" />
          <MethodBar label="NetBanking" percentage={3} color="bg-slate-400" />
        </div>
      </div>
    </div>
  </div>
);

/* --- 2. PAYMENTS LIST VIEW (WITH TOGGLEABLE FILTERS) --- */
const PaymentsListView = ({ onSelect }: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    id: '',
    orderId: '',
    customer: '',
    status: 'All',
    method: 'All'
  });

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      return (
        p.id.toLowerCase().includes(filters.id.toLowerCase()) &&
        p.orderId.toLowerCase().includes(filters.orderId.toLowerCase()) &&
        p.customer.name.toLowerCase().includes(filters.customer.toLowerCase()) &&
        (filters.status === 'All' || p.status === filters.status) &&
        (filters.method === 'All' || p.method === filters.method)
      );
    });
  }, [filters]);

  const clearFilters = () => setFilters({ id: '', orderId: '', customer: '', status: 'All', method: 'All' });
  const hasActiveFilters = filters.id || filters.orderId || filters.customer || filters.status !== 'All' || filters.method !== 'All';

  return (
    <div className="animate-in fade-in space-y-4">
      <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-sm overflow-hidden">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 bg-white border-b border-[#EEEEEE]">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <History size={16} /> Transaction History
          </h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="px-3 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                Reset
              </button>
            )}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${showFilters ? 'bg-black text-white border-black shadow-md' : 'bg-white text-black border-[#EEEEEE] hover:bg-gray-50'}`}
            >
              <Filter size={14}/> {showFilters ? 'Hide Filters' : 'Filter'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:opacity-80 transition-all shadow-md">
              <Download size={14}/> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest bg-[#FAFAFA]">
                <th className="px-6 pt-4 pb-2">Payment ID</th>
                <th className="px-6 pt-4 pb-2">Order ID</th>
                <th className="px-6 pt-4 pb-2">Customer</th>
                <th className="px-6 pt-4 pb-2">Amount</th>
                <th className="px-6 pt-4 pb-2">Method</th>
                <th className="px-6 pt-4 pb-2">Status</th>
                <th className="px-6 pt-4 pb-2 text-right">Detail</th>
              </tr>
              
              {/* FILTER ROW - Toggleable */}
              {showFilters && (
                <tr className="bg-[#FAFAFA] border-b border-[#EEEEEE] animate-in slide-in-from-top-1 duration-200">
                  <th className="px-4 pb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={12} />
                      <input 
                        type="text" 
                        placeholder="Search ID..." 
                        value={filters.id}
                        onChange={(e) => setFilters({...filters, id: e.target.value})}
                        className="w-full pl-7 pr-2 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[11px] outline-none focus:border-black font-medium shadow-sm" 
                      />
                    </div>
                  </th>
                  <th className="px-4 pb-4">
                    <input 
                      type="text" 
                      placeholder="Order #..." 
                      value={filters.orderId}
                      onChange={(e) => setFilters({...filters, orderId: e.target.value})}
                      className="w-full px-2 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[11px] outline-none focus:border-black font-medium shadow-sm" 
                    />
                  </th>
                  <th className="px-4 pb-4">
                    <input 
                      type="text" 
                      placeholder="Name..." 
                      value={filters.customer}
                      onChange={(e) => setFilters({...filters, customer: e.target.value})}
                      className="w-full px-2 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[11px] outline-none focus:border-black font-medium shadow-sm" 
                    />
                  </th>
                  <th className="px-4 pb-4"></th>
                  <th className="px-4 pb-4">
                    <select 
                      value={filters.method}
                      onChange={(e) => setFilters({...filters, method: e.target.value})}
                      className="w-full px-1 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[11px] outline-none focus:border-black font-medium shadow-sm cursor-pointer"
                    >
                      <option value="All">All Methods</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">CARD</option>
                      <option value="COD">COD</option>
                    </select>
                  </th>
                  <th className="px-4 pb-4">
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-1 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[11px] outline-none focus:border-black font-medium shadow-sm cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="PENDING">PENDING</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </th>
                  <th className="px-4 pb-4"></th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {filteredPayments.map(p => (
                <PaymentRow key={p.id} {...p} order={p.orderId} customer={p.customer.name} onSelect={onSelect} />
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#A1A1AA]">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={24} className="opacity-20" />
                      No transactions found matching your filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- 3. PAYMENT DETAIL DRAWER --- */
const PaymentDetailDrawer = ({ id, onClose }: { id: string, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'refund' | 'audit'>('summary');

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-[#FAFAFA]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{id}</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase border border-emerald-100">SUCCESS</span>
            </div>
            <p className="text-xs text-[#71717A] mt-1 flex items-center gap-1"><Clock size={12}/> Feb 10, 2026 • 14:22:15</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white border border-[#EEEEEE] rounded-full transition-colors shadow-sm"><X size={20}/></button>
        </div>

        {/* Detail Tabs */}
        <div className="flex px-6 border-b bg-white sticky top-0">
          {['summary', 'timeline', 'refund', 'audit'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab ? 'border-black text-black' : 'border-transparent text-[#A1A1AA] hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {activeTab === 'summary' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Order Total" value="₹1,450.00" icon={<Receipt size={14}/>} />
                <DetailBox label="Payment Method" value="Google Pay (UPI)" icon={<Wallet size={14}/>} />
                <DetailBox label="Gateway ID" value="pay_99201jksad88" icon={<Landmark size={14}/>} />
                <DetailBox label="Customer" value="Aditi Rao (+91 98200...)" icon={<User size={14}/>} />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase text-[#A1A1AA] tracking-widest">Settlement Breakdown</h4>
                <div className="p-4 bg-[#F9F9F9] rounded-xl space-y-3 border border-[#EEEEEE]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A]">Base Amount</span>
                    <span className="font-bold font-mono">₹1,380.95</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A]">Gateway Fee (2%)</span>
                    <span className="font-bold font-mono">₹29.00</span>
                  </div>
                  <div className="flex justify-between text-xs border-t pt-3 border-gray-200">
                    <span className="text-[#71717A]">Net Settlement Expected</span>
                    <span className="font-bold font-mono text-emerald-600">₹1,421.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <TimelineItem time="14:22:15" title="Payment Captured" desc="Successfully processed by Razorpay" status="success" />
              <TimelineItem time="14:21:40" title="Payment Authorized" desc="User completed UPI verification" status="success" />
              <TimelineItem time="14:21:05" title="Payment Created" desc="Transaction initiated from App Checkout" status="success" />
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <AlertCircle size={18} className="text-rose-600 shrink-0"/>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  Refunds typically take 5-7 business days to reflect in the customer's bank account after initiation.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-[#A1A1AA]">Refund Amount</label>
                  <input type="text" placeholder="Max ₹1,450" className="w-full p-3 border rounded-xl text-sm font-bold focus:ring-1 focus:ring-black outline-none transition-all shadow-sm" />
                </div>
                <button className="w-full py-4 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100">
                  <RefreshCcw size={14}/> Initiate Refund
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-[#FAFAFA] flex gap-3">
          <button className="flex-1 py-3 bg-white border border-[#EEEEEE] rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-all shadow-sm">
            <Download size={14}/> Receipt
          </button>
          <button className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#222] flex items-center justify-center gap-2 transition-all shadow-md">
            View Order
          </button>
        </div>
      </div>
    </>
  );
};

/* --- SUB-VIEWS --- */
const CODView = () => (
  <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-sm animate-in fade-in">
    <table className="w-full text-left">
      <thead className="bg-[#FAFAFA] border-b border-[#EEEEEE]">
        <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">
          <th className="px-6 py-4">Order ID</th>
          <th className="px-6 py-4">Amount</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#EEEEEE]">
        <tr className="text-sm group hover:bg-[#FAFAFA] transition-colors">
          <td className="px-6 py-4 font-bold">#ORD-5538</td>
          <td className="px-6 py-4 font-mono font-bold">₹2,100</td>
          <td className="px-6 py-4"><span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded uppercase">Out for Delivery</span></td>
          <td className="px-6 py-4 text-right"><button className="px-4 py-1.5 bg-black text-white rounded-lg text-[10px] font-bold shadow-sm">Mark Collected</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const RefundsView = () => (
  <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-sm animate-in fade-in">
      <table className="w-full text-left">
        <thead className="bg-[#FAFAFA] border-b border-[#EEEEEE]">
          <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">
            <th className="px-6 py-4">Refund ID</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEEEEE]">
          <tr className="text-sm group hover:bg-[#FAFAFA] transition-colors">
            <td className="px-6 py-4 font-mono text-xs font-bold">RFD-9901</td>
            <td className="px-6 py-4 font-bold text-rose-600">₹450.00</td>
            <td className="px-6 py-4"><span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded uppercase">Processed</span></td>
          </tr>
        </tbody>
      </table>
  </div>
);

const SettlementsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
      <div className="p-6 bg-white border border-[#EEEEEE] rounded-2xl shadow-sm">
        <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Next Payout</p>
        <h4 className="text-2xl font-bold mt-1">₹42,100.50</h4>
        <p className="text-[10px] text-[#A1A1AA] mt-2">Scheduled for 12 Feb</p>
      </div>
      <div className="p-6 bg-white border border-[#EEEEEE] rounded-2xl shadow-sm">
        <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Last Settlement</p>
        <h4 className="text-2xl font-bold mt-1">₹1,12,000.00</h4>
        <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={10}/> Paid on 08 Feb</p>
      </div>
    </div>
);

const DisputesView = () => (
  <div className="bg-white p-12 border border-[#EEEEEE] rounded-2xl shadow-sm text-center space-y-4 animate-in fade-in">
    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><ShieldCheck size={40}/></div>
    <h3 className="text-xl font-bold">All clear!</h3>
    <p className="text-sm text-[#71717A] max-w-xs mx-auto">There are no open customer disputes or chargebacks at this moment.</p>
  </div>
);

/* --- HELPER COMPONENTS --- */
const NavTab = ({ id, active, label, icon, onClick }: any) => (
  <button 
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
      active === id ? 'bg-black text-white shadow-md' : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-black'
    }`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, trend, trendType, sub }: any) => (
  <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-[10px] font-bold uppercase text-[#A1A1AA] tracking-widest">{label}</p>
    <div className="flex items-baseline gap-2 mt-1">
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendType === 'up' ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {trend}
      </span>
    </div>
    <p className="text-[10px] text-[#A1A1AA] mt-1 font-medium">{sub}</p>
  </div>
);

const MethodBar = ({ label, percentage, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold"><span>{label}</span><span className="text-[#71717A]">{percentage}%</span></div>
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner"><div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} /></div>
  </div>
);

const PaymentRow = ({ id, date, order, customer, amount, method, status, onSelect }: any) => (
  <tr className="group hover:bg-[#FBFBFA] transition-colors cursor-pointer" onClick={() => onSelect(id)}>
    <td className="px-6 py-4"><p className="text-xs font-bold">{id}</p><p className="text-[10px] text-[#A1A1AA]">{date}</p></td>
    <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{order}</td>
    <td className="px-6 py-4 text-xs font-medium">{customer}</td>
    <td className="px-6 py-4 font-mono text-sm font-bold">₹{amount.toLocaleString()}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#71717A]">
        {method === 'UPI' ? <Landmark size={12}/> : method === 'COD' ? <Banknote size={12}/> : <CreditCard size={12}/>}
        {method}
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border shadow-sm ${
        status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
        status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
        'bg-amber-50 text-amber-600 border-amber-100'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="p-2 text-[#A1A1AA] group-hover:text-black group-hover:bg-[#F4F4F5] rounded-lg transition-all inline-block"><ChevronRight size={16} /></div>
    </td>
  </tr>
);

const TimelineItem = ({ time, title, desc, status }: any) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ring-4 ring-white shadow-sm ${status === 'success' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      <div className="w-px h-full bg-gray-100 mt-1" />
    </div>
    <div className="pb-8">
      <p className="text-[10px] font-mono text-[#A1A1AA] font-bold">{time}</p>
      <p className="text-sm font-bold text-[#18181B]">{title}</p>
      <p className="text-xs text-[#71717A] mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const DetailBox = ({ label, value, icon }: any) => (
  <div className="p-4 border border-[#EEEEEE] rounded-xl space-y-1.5 shadow-sm bg-white hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-1.5 text-[#A1A1AA] font-bold uppercase tracking-widest text-[9px]">
      {icon} <span>{label}</span>
    </div>
    <p className="text-sm font-bold truncate text-[#18181B]">{value}</p>
  </div>
);

export default PaymentManagement;