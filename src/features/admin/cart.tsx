import React, { useState } from 'react';
import { 
  ShoppingCart, RefreshCcw, Trash2, Mail, X, 
  Scale, Clock, ThermometerSnowflake, Info,
  ChevronRight, AlertTriangle, CheckCircle2, Calendar
} from 'lucide-react';

/* --- TYPES --- */
type WeightPack = '250g' | '500g' | '1kg' | 'Bulk';
type ProcessingStyle = 'Whole' | 'Cleaned' | 'Deveined' | 'Curry Cut' | 'Steaks';

interface SeafoodCartItem {
  id: string;
  name: string;
  category: 'Shellfish' | 'Seawater' | 'Freshwater';
  image: string;
  selectedWeight: WeightPack;
  processing: ProcessingStyle;
  pricePerKg: number;
  qty: number; // number of packs
  isAvailableForSlot: boolean;
}

interface SeafoodCart {
  id: string;
  customer: string;
  phone: string;
  items: SeafoodCartItem[];
  deliverySlot: {
    date: string;
    time: string;
    isExpress: boolean;
  };
  totalWeight: number; // in grams
  subtotal: number;
  cleaningCharges: number;
  status: 'Active' | 'Abandoned';
}

const CartManagement: React.FC = () => {
  const [selectedCart, setSelectedCart] = useState<SeafoodCart | null>(null);

  // Mock Data: Specialized for Seafood
  const activeCarts: SeafoodCart[] = [
    {
      id: 'CRT-7721',
      customer: 'Anjali Sharma',
      phone: '+91 98450 12345',
      status: 'Active',
      deliverySlot: { date: 'Feb 11, 2026', time: '08:00 AM - 11:00 AM', isExpress: false },
      items: [
        {
          id: 'p1',
          name: 'Tiger Prawns (Medium)',
          category: 'Shellfish',
          image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=100',
          selectedWeight: '500g',
          processing: 'Deveined',
          pricePerKg: 850,
          qty: 1,
          isAvailableForSlot: true
        },
        {
          id: 'p2',
          name: 'Black Pomfret',
          category: 'Seawater',
          image: 'https://images.unsplash.com/photo-1534341513206-81531236968f?auto=format&fit=crop&q=80&w=100',
          selectedWeight: '1kg',
          processing: 'Curry Cut',
          pricePerKg: 1200,
          qty: 1,
          isAvailableForSlot: true
        }
      ],
      totalWeight: 1500,
      subtotal: 1625,
      cleaningCharges: 40
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- PERISHABLE LOGISTICS HEADLINE --- */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[240px] p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ThermometerSnowflake size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Cold Chain Status</p>
            <p className="text-sm font-bold text-blue-900">Optimal (4°C - 6°C)</p>
          </div>
        </div>
        <div className="flex-1 min-w-[240px] p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-amber-500 rounded-lg text-white">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Cut-off Alert</p>
            <p className="text-sm font-bold text-amber-900">3 Carts near 3PM deadline</p>
          </div>
        </div>
      </div>

      {/* --- LIVE CART TABLE --- */}
      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
        <div className="p-6 border-b border-[#EEEEEE] bg-[#FAFAFA]/50 flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center gap-2 italic">
            <ShoppingCart size={16}/> Live Seafood Baskets
          </h2>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
            6 Active Sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest border-b border-[#EEEEEE]">
                <th className="px-6 py-4">Customer & Slot</th>
                <th className="px-6 py-4">Weight Summary</th>
                <th className="px-6 py-4">Processing Details</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {activeCarts.map((cart) => (
                <tr key={cart.id} className="group hover:bg-[#FBFBFA] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{cart.customer}</span>
                      <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 mt-1">
                        <Calendar size={10}/> {cart.deliverySlot.date} | {cart.deliverySlot.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Scale size={14} className="text-[#A1A1AA]"/>
                      <span className="text-xs font-bold">{cart.totalWeight / 1000} KG</span>
                    </div>
                    <div className="flex -space-x-2 mt-2">
                      {cart.items.map((item, idx) => (
                        <img key={idx} src={item.image} className="w-6 h-6 rounded-full border border-white" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {cart.items.map((item, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                          {item.processing}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold">₹{cart.subtotal + cart.cleaningCharges}</p>
                    <p className="text-[9px] text-[#A1A1AA]">Incl. ₹{cart.cleaningCharges} cleaning</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedCart(cart)}
                      className="text-xs font-bold hover:underline"
                    >
                      View Basket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SEAFOOD BASKET DETAILS (SLIDE-OVER) --- */}
      {selectedCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCart(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Basket Analysis</h3>
                <p className="text-xs text-[#A1A1AA]">ID: {selectedCart.id}</p>
              </div>
              <button onClick={() => setSelectedCart(null)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Delivery Warning */}
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex gap-3">
                <AlertTriangle className="text-rose-500 shrink-0" size={18}/>
                <div>
                  <p className="text-xs font-bold text-rose-900 uppercase">Perishable Window</p>
                  <p className="text-[11px] text-rose-700 leading-relaxed mt-1">
                    Items like <b>{selectedCart.items[0].name}</b> have high turnover. Order needs to be confirmed within 2 hours to guarantee this morning's catch.
                  </p>
                </div>
              </div>

              {/* Items with Weights */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase text-[#A1A1AA] tracking-widest">Cart Content</h4>
                {selectedCart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border border-[#EEEEEE] rounded-xl relative">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-sm font-bold">₹{item.pricePerKg * (parseInt(item.selectedWeight) / 1000) || 425}</p>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
                          {item.selectedWeight}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded uppercase">
                          {item.processing}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A1A1AA] mt-2 italic">
                        Market Price: ₹{item.pricePerKg}/kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary with Cleaning Fees */}
              <div className="bg-[#F9F9F9] p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Subtotal</span>
                  <span className="font-bold">₹{selectedCart.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Cleaning & Processing</span>
                  <span className="font-bold text-emerald-600">+ ₹{selectedCart.cleaningCharges}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Delivery Fee (Cold Chain)</span>
                  <span className="font-bold">₹49</span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="text-sm font-bold">Total Amount</span>
                  <span className="text-lg font-bold">₹{selectedCart.subtotal + selectedCart.cleaningCharges + 49}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border rounded-xl text-xs font-bold hover:bg-gray-50">
                <Mail size={14}/> Send Reminder
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-xs font-bold">
                Confirm Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartManagement;