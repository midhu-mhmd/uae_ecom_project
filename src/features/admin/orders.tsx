import React, { useState } from 'react';
import { 
  Search, Filter, Eye, XCircle, Download, CreditCard, Package, 
  Printer, MoreVertical, Smartphone, LayoutGrid, ChevronDown
} from 'lucide-react';

/* --- TYPES --- */
type OrderStatus = 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled' | 'Returned';
type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  items: OrderItem[];
}

const OrderManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const orders: Order[] = [
    { 
      id: 'ORD-2201', 
      customer: 'Alexander Rossi', 
      email: 'alex@example.com', 
      phone: '+91 98765 43210',
      date: 'Feb 10, 2026', 
      total: 299.00, 
      status: 'Processing', 
      payment: 'Paid',
      paymentMethod: 'UPI',
      items: [{ id: 'p1', name: 'Cotton Tee', sku: 'TEE-BLK', price: 149, quantity: 2 }]
    },
    { 
        id: 'ORD-2202', 
        customer: 'Elena Gilbert', 
        email: 'elena@mystic.com', 
        phone: '+91 88271 11200',
        date: 'Feb 11, 2026', 
        total: 85.50, 
        status: 'Shipped', 
        payment: 'Pending',
        paymentMethod: 'COD',
        items: [{ id: 'p2', name: 'Linen Shirt', sku: 'LIN-WHT', price: 85.50, quantity: 1 }]
      },
  ];

  return (
    <div className="space-y-6">
      {/* --- INTEGRATED TABLE CARD --- */}
      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-sm">
        
        {/* --- TABLE TOOLBAR --- */}
        <div className="p-4 border-b border-[#EEEEEE] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-sm font-black uppercase tracking-widest">Orders</h2>
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={14} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="w-full pl-9 pr-4 py-1.5 bg-[#F9F9F9] border border-transparent rounded-lg text-xs focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[11px] font-bold transition-all ${isFilterOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-[#EEEEEE] hover:bg-gray-50'}`}
            >
              <Filter size={14} /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EEEEEE] rounded-lg text-[11px] font-bold hover:bg-gray-50">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA]">
              <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest border-b border-[#EEEEEE]">
                <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-3">Order / Date</th>
                <th className="px-4 py-3">Customer Information</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>

              {/* --- DYNAMIC FILTER ROW (Opens under headers) --- */}
              {isFilterOpen && (
                <tr className="bg-white border-b border-[#EEEEEE] animate-in slide-in-from-top-1 duration-200">
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2">
                    <input type="text" placeholder="ID..." className="w-full p-1.5 text-[10px] border border-gray-200 rounded outline-none focus:border-black" />
                  </td>
                  <td className="px-4 py-2">
                    {/* FILTER DIRECTLY UNDER CUSTOMER INFO */}
                    <div className="flex gap-2">
                        <input type="text" placeholder="Filter Name..." className="w-1/2 p-1.5 text-[10px] border border-gray-200 rounded outline-none focus:border-black" />
                        <input type="text" placeholder="Filter Email..." className="w-1/2 p-1.5 text-[10px] border border-gray-200 rounded outline-none focus:border-black" />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="Min $" className="w-full p-1.5 text-[10px] border border-gray-200 rounded outline-none focus:border-black" />
                  </td>
                  <td className="px-4 py-2">
                    <select className="w-full p-1.5 text-[10px] border border-gray-200 rounded bg-white outline-none">
                        <option>All</option>
                        <option>Paid</option>
                        <option>Pending</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="w-full p-1.5 text-[10px] border border-gray-200 rounded bg-white outline-none">
                        <option>All</option>
                        <option>UPI</option>
                        <option>COD</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                     <select className="w-full p-1.5 text-[10px] border border-gray-200 rounded bg-white outline-none">
                        <option>All Status</option>
                        <option>Shipped</option>
                        <option>Processing</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-[9px] font-bold text-gray-400 hover:text-black underline">Reset</button>
                  </td>
                </tr>
              )}
            </thead>
            
            <tbody className="divide-y divide-[#EEEEEE]">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-[#FBFBFA] transition-colors">
                  <td className="px-4 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-4">
                    <p className="text-[11px] font-mono font-bold text-black">{order.id}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{order.date}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-800">{order.customer}</span>
                        <span className="text-[10px] text-[#A1A1AA]">{order.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12px] font-black">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border uppercase ${
                      order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        {order.paymentMethod === 'UPI' && <Smartphone size={14}/>}
                        {order.paymentMethod === 'COD' && <Package size={14}/>}
                        <span className="text-[11px] font-medium">{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Processing' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <span className="text-[11px] font-bold text-gray-700">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black hover:text-white transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ORDER DETAILS SLIDE-OVER --- */}
      {selectedOrder && (
        <OrderDetailsPanel 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

/* Component for the Slide-over */
const OrderDetailsPanel = ({ order, onClose }: { order: Order, onClose: () => void }) => (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-[#EEEEEE] flex justify-between items-center bg-white sticky top-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 text-white rounded-lg"><Package size={18}/></div>
                <div>
                    <h2 className="text-lg font-black">{order.id}</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Customer Order</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 border rounded-lg hover:bg-gray-50"><XCircle size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#EEEEEE] flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Current Status</p>
                    <p className="text-sm font-black text-black">{order.status}</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    Update Status <ChevronDown size={14}/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Name</p>
                    <p className="text-sm font-bold text-gray-800">{order.customer}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                    <p className="text-sm font-bold text-gray-800">{order.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b pb-2">Purchased Items</h4>
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                        <div>
                            <p className="text-xs font-bold">{item.name}</p>
                            <p className="text-[10px] text-gray-400">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold">${item.price}</p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                        </div>
                    </div>
                 ))}
                 <div className="pt-4 border-t border-dashed flex justify-between items-center">
                    <span className="text-xs font-bold">Total Amount</span>
                    <span className="text-lg font-black text-emerald-600">${order.total}</span>
                 </div>
            </div>
        </div>
      </div>
    </>
);

export default OrderManagement;