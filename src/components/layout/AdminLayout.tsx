import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Star, 
  CreditCard, 
  Settings, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShoppingCart,
  Mail,
  Trash2,
  MousePointer2,
  RefreshCcw,
  Menu, // Added for mobile
  X     // Added for mobile
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation: NavItem[] = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
    { label: 'Carts', path: '/admin/cart', icon: <ShoppingCart size={18} strokeWidth={1.5} /> },
    { label: 'Products', path: '/admin/products', icon: <Package size={18} strokeWidth={1.5} /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <Star size={18} strokeWidth={1.5} /> },
    { label: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} strokeWidth={1.5} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex h-screen bg-white text-[#121212] font-sans overflow-hidden">
      {/* --- SIDEBAR: Mobile Overlay --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 bg-[#FAFAFA] border-r border-[#EEEEEE] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          lg:translate-x-0 lg:static 
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          flex flex-col
        `}
      >
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-mono font-bold text-sm">S</div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="ml-3 font-bold text-sm tracking-[0.2em] uppercase">Solv.</span>
            )}
          </div>
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block text-[#A1A1AA] hover:text-black transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-2 px-3 space-y-0.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#E5E5E5]' 
                    : 'text-[#71717A] hover:text-black hover:bg-[#F4F4F5]'
                }`}
              >
                <span className={`${isActive ? 'text-black' : 'text-[#A1A1AA] group-hover:text-black'}`}>
                  {item.icon}
                </span>
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EEEEEE]">
          <Link to="/" className="flex items-center gap-3 px-3 py-3 text-[#71717A] hover:text-black transition-all">
            <ExternalLink size={16} strokeWidth={1.5} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-xs font-semibold tracking-widest uppercase">Live Store</span>}
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* --- HEADER --- */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-[#EEEEEE] bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#A1A1AA] hover:text-black"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="text-[#A1A1AA] hover:text-black relative">
              <Bell size={18} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-black rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 border-l border-[#EEEEEE] pl-4 md:pl-6">
              <div className="text-right hidden md:block">
                <p className="text-[12px] font-bold leading-none">Noorumoon</p>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">Proprietor</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F4F4F5] border border-[#E5E5E5] flex items-center justify-center text-[10px] font-bold hover:bg-black hover:text-white transition-all cursor-pointer">
                N
              </div>
            </div>
          </div>
        </header>

        {/* --- VIEWPORT --- */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
             {location.pathname === '/admin/carts' ? <CartManagementView /> : <Outlet />} 
          </div>
        </main>
      </div>
    </div>
  );
};

/* --- RESPONSIVE CART MANAGEMENT VIEW --- */
const CartManagementView: React.FC = () => {
  const carts = [
    { id: 'CRT-9901', customer: 'Liam Neeson', items: 3, total: '$420.00', status: 'Abandoned', lastActive: '2 mins ago' },
    { id: 'CRT-9902', customer: 'Sarah Connor', items: 1, total: '$1,200.00', status: 'Active', lastActive: 'Just now' },
    { id: 'CRT-9903', customer: 'Guest #441', items: 5, total: '$85.50', status: 'Abandoned', lastActive: '4 hours ago' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">Cart Management</h1>
          <p className="text-[#71717A] text-sm mt-1">Monitor intent and recover sessions.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md text-xs font-bold hover:bg-[#222] transition-all">
          <RefreshCcw size={14} /> Sync Live Data
        </button>
      </section>

      {/* Grid: 1 col on mobile, 3 on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Active Carts', value: '42', detail: 'Real-time sessions' },
          { label: 'Abandoned Rate', value: '64.2%', detail: '+2.1% vs LW' },
          { label: 'Recovery Potential', value: '$8,240', detail: 'In abandoned items' },
        ].map((stat, i) => (
          <div key={i} className="p-5 md:p-6 border border-[#EEEEEE] rounded-xl hover:border-black transition-all group bg-[#FAFAFA]/50">
            <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest group-hover:text-black">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            <p className="text-[11px] text-[#71717A] mt-1">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[#EEEEEE] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest">Session Activity</h2>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none text-[10px] font-bold border border-[#E5E5E5] px-3 py-1.5 rounded hover:bg-[#FAFAFA]">Filter</button>
             <button className="flex-1 md:flex-none text-[10px] font-bold border border-[#E5E5E5] px-3 py-1.5 rounded hover:bg-[#FAFAFA]">Export</button>
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
                <th className="px-6 py-4 border-b border-[#EEEEEE] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {carts.map((cart, i) => (
                <tr key={i} className="group hover:bg-[#FBFBFA] transition-colors">
                  <td className="px-6 py-5 font-mono text-xs text-[#71717A]">{cart.id}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold leading-none">{cart.customer}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-1.5">{cart.lastActive}</p>
                  </td>
                  <td className="px-6 py-5 text-sm">{cart.items} Units</td>
                  <td className="px-6 py-5 text-sm font-bold">{cart.total}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      cart.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {cart.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-black hover:text-white rounded-md transition-colors"><Mail size={14} /></button>
                      <button className="p-2 hover:bg-black hover:text-white rounded-md transition-colors"><MousePointer2 size={14} /></button>
                      <button className="p-2 hover:text-rose-600 rounded-md transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;