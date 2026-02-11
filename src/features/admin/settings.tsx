import React, { useState } from 'react';
import { 
  Store, Clock, MapPin, CreditCard, Truck, Receipt, 
  ShoppingBag, Undo2, Bell, Users, Shield, Globe, 
  Settings, Save, Plus, Trash2, CheckCircle2, AlertTriangle,
  Eye, EyeOff, Search, FileUp, ChevronRight, Menu
} from 'lucide-react';

/* --- TYPES --- */
type SettingSection = 
  | 'profile' | 'hours' | 'service' | 'payments' 
  | 'delivery' | 'tax' | 'orders' | 'returns' 
  | 'notifications' | 'users' | 'security' | 'seo' | 'integrations';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingSection>('hours');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex text-[#18181B] animate-in fade-in duration-500">
      
      {/* --- LEFT SIDEBAR NAV --- */}
      <aside className={`bg-white border-r border-[#EEEEEE] transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col`}>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className={`font-bold text-lg tracking-tight ${!isSidebarOpen && 'hidden'}`}>Settings</h2>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-[#F4F4F5] rounded-lg">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <NavGroup label="General" isOpen={isSidebarOpen}>
            <NavItem id="profile" icon={<Store size={18}/>} label="Store Profile" active={activeTab} onClick={setActiveTab} />
            <NavItem id="hours" icon={<Clock size={18}/>} label="Hours & Slots" active={activeTab} onClick={setActiveTab} />
            <NavItem id="service" icon={<MapPin size={18}/>} label="Service Area" active={activeTab} onClick={setActiveTab} />
          </NavGroup>

          <NavGroup label="Operations" isOpen={isSidebarOpen}>
            <NavItem id="payments" icon={<CreditCard size={18}/>} label="Payments" active={activeTab} onClick={setActiveTab} />
            <NavItem id="delivery" icon={<Truck size={18}/>} label="Shipping Rules" active={activeTab} onClick={setActiveTab} />
            <NavItem id="tax" icon={<Receipt size={18}/>} label="Tax & Invoicing" active={activeTab} onClick={setActiveTab} />
            <NavItem id="orders" icon={<ShoppingBag size={18}/>} label="Order Workflow" active={activeTab} onClick={setActiveTab} />
            <NavItem id="returns" icon={<Undo2 size={18}/>} label="Return Policy" active={activeTab} onClick={setActiveTab} />
          </NavGroup>

          <NavGroup label="System" isOpen={isSidebarOpen}>
            <NavItem id="notifications" icon={<Bell size={18}/>} label="Notifications" active={activeTab} onClick={setActiveTab} />
            <NavItem id="users" icon={<Users size={18}/>} label="Team & Roles" active={activeTab} onClick={setActiveTab} />
            <NavItem id="security" icon={<Shield size={18}/>} label="Security" active={activeTab} onClick={setActiveTab} />
            <NavItem id="seo" icon={<Globe size={18}/>} label="SEO & App" active={activeTab} onClick={setActiveTab} />
          </NavGroup>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#EEEEEE] flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-xs text-[#71717A]">Manage your store's configuration and preferences.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-[#EEEEEE] rounded-xl text-xs font-bold hover:bg-[#F4F4F5] transition-all">Discard Changes</button>
            <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#222] transition-all shadow-md">
              <Save size={14}/> Save Changes
            </button>
          </div>
        </header>

        {/* Content Render */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'hours' && <HoursSlotsView />}
            {activeTab === 'service' && <ServiceAreaView />}
            {activeTab === 'payments' && <PaymentSettingsView />}
            {activeTab === 'returns' && <ReturnsPolicyView />}
            {activeTab === 'notifications' && <NotificationSettingsView />}
            {/* Other views would be mapped here */}
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- 3. BUSINESS HOURS & SLOTS (Critical for Seafood) --- */
const HoursSlotsView = () => (
  <div className="space-y-8">
    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold mb-4">Operational Days</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="flex flex-col items-center gap-2 p-3 border rounded-xl bg-[#FAFAFA]">
            <span className="text-[10px] font-bold text-[#A1A1AA]">{day}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
          </div>
        ))}
      </div>
    </section>

    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold">Delivery Slots</h3>
        <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1">
          <Plus size={12}/> Add Slot
        </button>
      </div>
      
      <div className="space-y-3">
        <SlotRow name="Early Morning" start="06:00 AM" end="09:00 AM" cutoff="09:00 PM (Previous Day)" capacity={40} />
        <SlotRow name="Lunch Rush" start="11:00 AM" end="01:00 PM" cutoff="08:00 AM" capacity={25} />
        <SlotRow name="Evening" start="05:00 PM" end="08:00 PM" cutoff="02:00 PM" capacity={50} />
      </div>
    </section>
  </div>
);

/* --- 4. SERVICE AREA (Pincodes) --- */
const ServiceAreaView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <div>
        <h3 className="text-sm font-bold">Serviceable Pincodes</h3>
        <p className="text-xs text-[#A1A1AA]">Manage delivery fees and COD availability by zone.</p>
      </div>
      <button className="px-3 py-2 bg-[#F4F4F5] rounded-xl text-[10px] font-bold flex items-center gap-2">
        <FileUp size={14}/> Bulk CSV Import
      </button>
    </div>

    <div className="bg-white border border-[#EEEEEE] rounded-2xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#FAFAFA] border-b text-[10px] font-bold uppercase text-[#A1A1AA]">
          <tr>
            <th className="px-6 py-4">Pincode / Zone</th>
            <th className="px-6 py-4">Delivery Fee</th>
            <th className="px-6 py-4">Min. Order</th>
            <th className="px-6 py-4">COD</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEEEEE]">
          <PincodeRow zip="560001" zone="Central BLR" fee="₹49" min="₹499" cod={true} />
          <PincodeRow zip="560067" zone="Whitefield" fee="₹99" min="₹999" cod={false} />
        </tbody>
      </table>
    </div>
  </div>
);

/* --- 5. PAYMENT SETTINGS --- */
const PaymentSettingsView = () => (
  <div className="space-y-6">
    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <CreditCard size={24}/>
        </div>
        <div>
          <h3 className="text-sm font-bold">Razorpay Integration</h3>
          <p className="text-xs text-[#A1A1AA]">Primary gateway for UPI, Cards, and NetBanking.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase">Connected</span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Key ID" type="password" value="rzp_live_xxxxxxxxxx" />
          <InputGroup label="Key Secret" type="password" value="••••••••••••••••" />
        </div>
        <button className="text-xs font-bold text-blue-600 hover:underline">Test Webhook Connection</button>
      </div>
    </section>

    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold mb-4">COD Thresholds</h3>
      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Min COD Value" placeholder="e.g. ₹300" />
        <InputGroup label="Max COD Value" placeholder="e.g. ₹5000" />
      </div>
    </section>
  </div>
);

/* --- 9. RETURNS POLICY (Perishables Logic) --- */
const ReturnsPolicyView = () => (
  <div className="space-y-6">
    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
      <AlertTriangle className="text-amber-600 shrink-0" size={18} />
      <p className="text-xs text-amber-800 leading-relaxed">
        <strong>Warning:</strong> You are selling perishable goods (Fresh Fish). It is highly recommended to set a return window of less than 6 hours or "No Return" unless damaged.
      </p>
    </div>

    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
      <ToggleItem label="Enable Returns/Replacements" sub="Allow customers to request returns via the app" defaultOn={true} />
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <InputGroup label="Return Window (Hours)" value="4" />
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-[#A1A1AA]">Proof Requirements</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-black" />
            <span className="text-xs">Photo of product required</span>
          </div>
        </div>
      </div>
    </section>
  </div>
);

/* --- 10. NOTIFICATIONS --- */
const NotificationSettingsView = () => (
  <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
    <h3 className="text-sm font-bold">Automated Alerts</h3>
    <div className="divide-y divide-[#EEEEEE]">
      <NotificationToggle label="Order Placed" channels={['SMS', 'WhatsApp', 'Email']} />
      <NotificationToggle label="Out for Delivery" channels={['SMS', 'WhatsApp']} />
      <NotificationToggle label="Delivery Slot Reminder" channels={['WhatsApp']} />
      <NotificationToggle label="Order Cancelled" channels={['SMS', 'Email']} />
    </div>
  </section>
);

/* --- HELPER COMPONENTS --- */

const NavGroup = ({ label, children, isOpen }: any) => (
  <div className="py-4 space-y-2">
    {isOpen && <h4 className="px-4 text-[10px] font-bold uppercase text-[#A1A1AA] tracking-widest">{label}</h4>}
    {children}
  </div>
);

const NavItem = ({ id, icon, label, active, onClick }: any) => (
  <button 
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
      active === id ? 'bg-black text-white shadow-md' : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-black'
    }`}
  >
    {icon}
    <span className="text-sm font-medium truncate">{label}</span>
  </button>
);

const SlotRow = ({ name, start, end, cutoff, capacity }: any) => (
  <div className="flex items-center justify-between p-4 border rounded-xl hover:border-black transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-[#FAFAFA] rounded-full flex items-center justify-center text-[#71717A]">
        <Clock size={16}/>
      </div>
      <div>
        <p className="text-xs font-bold">{name}</p>
        <p className="text-[10px] text-[#A1A1AA]">{start} — {end}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="text-right">
        <p className="text-[10px] font-bold text-[#71717A] uppercase">Cut-off</p>
        <p className="text-[10px] font-mono">{cutoff}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-[#71717A] uppercase">Capacity</p>
        <p className="text-[10px] font-mono font-bold">{capacity} Orders</p>
      </div>
      <button className="p-2 text-[#A1A1AA] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
        <Trash2 size={16}/>
      </button>
    </div>
  </div>
);

const PincodeRow = ({ zip, zone, fee, min, cod }: any) => (
  <tr className="hover:bg-[#FBFBFA]">
    <td className="px-6 py-4">
      <p className="text-xs font-bold">{zip}</p>
      <p className="text-[10px] text-[#A1A1AA]">{zone}</p>
    </td>
    <td className="px-6 py-4 font-mono text-xs font-bold">{fee}</td>
    <td className="px-6 py-4 font-mono text-xs text-[#71717A]">{min}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cod ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {cod ? 'COD ON' : 'PREPAID ONLY'}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={14}/></button>
    </td>
  </tr>
);

const InputGroup = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase text-[#A1A1AA] tracking-wider">{label}</label>
    <div className="relative">
      <input 
        className="w-full px-4 py-2.5 bg-[#F9F9F9] border-none rounded-xl text-sm focus:ring-1 focus:ring-black outline-none transition-all"
        {...props} 
      />
    </div>
  </div>
);

const ToggleItem = ({ label, sub, defaultOn }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xs text-[#A1A1AA]">{sub}</p>
    </div>
    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${defaultOn ? 'bg-black' : 'bg-[#E5E5E5]'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${defaultOn ? 'left-7' : 'left-1'}`} />
    </div>
  </div>
);

const NotificationToggle = ({ label, channels }: any) => (
  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
    <p className="text-xs font-medium">{label}</p>
    <div className="flex gap-2">
      {['SMS', 'WhatsApp', 'Email'].map(ch => (
        <button 
          key={ch}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
            channels.includes(ch) ? 'bg-black text-white border-black' : 'text-[#A1A1AA] border-[#EEEEEE] hover:bg-gray-50'
          }`}
        >
          {ch}
        </button>
      ))}
    </div>
  </div>
);

export default SettingsPage;