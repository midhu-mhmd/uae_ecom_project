import React, { useState, useMemo } from 'react';
import { 
  Star, Search, Filter, CheckCircle2,
  MessageSquare, ChevronRight, Download, RotateCcw
} from 'lucide-react';

/* --- TYPES --- */
type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'Hidden';
type FilterStatus = ReviewStatus | 'All';

interface Review {
  id: string;
  date: string;
  rating: number;
  product: { name: string; sku: string; image: string };
  customer: { name: string; contact: string };
  comment: string;
  status: ReviewStatus;
}

const ReviewsManagement: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Default open to match screenshot feel
  const [searchTerm, setSearchTerm] = useState("");
  
  /* --- COLUMN SPECIFIC FILTER STATES --- */
  const [filterId, setFilterId] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterRating, setFilterRating] = useState<number | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');

  const allReviews: Review[] = [
    {
      id: 'REV-2001',
      date: 'Feb 10, 2026',
      rating: 5,
      product: { name: 'Fresh Atlantic Salmon', sku: 'SEA-SAL-01', image: '🐟' },
      customer: { name: 'Rahul Deshmukh', contact: '+91 98200 11223' },
      comment: 'Absolutely fresh!',
      status: 'Approved',
    },
    {
      id: 'REV-2002',
      date: 'Feb 09, 2026',
      rating: 1,
      product: { name: 'Tiger Prawns (Large)', sku: 'SEA-PRN-05', image: '🦐' },
      customer: { name: 'Sneha Kapoor', contact: 'sneha.k@gmail.com' },
      comment: 'Smelled a bit off.',
      status: 'Pending',
    }
  ];

  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
      const matchesRating = filterRating === 'All' || review.rating === filterRating;
      const matchesId = review.id.toLowerCase().includes(filterId.toLowerCase());
      const matchesCustomer = review.customer.name.toLowerCase().includes(filterCustomer.toLowerCase());
      const matchesQuickSearch = review.product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesRating && matchesId && matchesCustomer && matchesQuickSearch;
    });
  }, [searchTerm, statusFilter, filterRating, filterId, filterCustomer]);

  const resetFilters = () => {
    setStatusFilter('All');
    setFilterRating('All');
    setFilterId("");
    setFilterCustomer("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-6 p-6 bg-[#FDFDFD] min-h-screen font-sans">
      
      {/* --- TOP TOOLBAR --- */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden shadow-sm">
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-4">
            Reviews
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={14} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#F9F9F9] border border-transparent rounded-lg text-xs focus:bg-white focus:border-black transition-all outline-none"
              />
            </div>
          </h2>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isFilterOpen ? 'bg-black text-white' : 'bg-white text-black border border-[#EEEEEE]'
              }`}
            >
              <Filter size={14} /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EEEEEE] text-black rounded-lg text-xs font-bold hover:bg-gray-50">
              <Download size={14}/> Export
            </button>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white">
              {/* Main Headers */}
              <tr className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest border-b border-[#EEEEEE]">
                <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-6 py-4">Review ID / Date</th>
                <th className="px-6 py-4">Customer Information</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>

              {/* Filter Inputs Row (Screenshot Style) */}
              {isFilterOpen && (
                <tr className="bg-white border-b border-[#EEEEEE]">
                  <td className="px-6 py-2"></td>
                  <td className="px-6 py-2">
                    <input 
                      type="text" 
                      placeholder="ID..." 
                      value={filterId}
                      onChange={(e) => setFilterId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#EEEEEE] rounded text-[11px] outline-none focus:border-black/20"
                    />
                  </td>
                  <td className="px-6 py-2">
                    <input 
                      type="text" 
                      placeholder="Filter Name..." 
                      value={filterCustomer}
                      onChange={(e) => setFilterCustomer(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#EEEEEE] rounded text-[11px] outline-none focus:border-black/20"
                    />
                  </td>
                  <td className="px-6 py-2">
                    <select 
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-[#EEEEEE] rounded text-[11px] outline-none font-medium"
                    >
                      <option value="All">All Stars</option>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-2">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                      className="w-full px-2 py-1.5 bg-white border border-[#EEEEEE] rounded text-[11px] outline-none font-medium"
                    >
                      <option value="All">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <button onClick={resetFilters} className="text-[10px] font-bold text-[#A1A1AA] hover:text-black uppercase">Reset</button>
                  </td>
                </tr>
              )}
            </thead>
            
            <tbody className="divide-y divide-[#EEEEEE]">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="group hover:bg-[#FBFBFA] transition-colors">
                  <td className="px-6 py-5"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-black">{r.id}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">{r.date}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-black">{r.customer.name}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">{r.customer.contact}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors inline-block text-[#A1A1AA] hover:text-black">
                      <ChevronRight size={18} />
                    </button>
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

/* --- SUB-COMPONENTS --- */
const StatusBadge = ({ status }: { status: ReviewStatus }) => {
  const styles = {
    Pending: "text-amber-600 before:bg-amber-600",
    Approved: "text-emerald-600 before:bg-emerald-600",
    Rejected: "text-rose-600 before:bg-rose-600",
    Hidden: "text-slate-500 before:bg-slate-500"
  };
  return (
    <span className={`text-xs font-bold flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default ReviewsManagement;