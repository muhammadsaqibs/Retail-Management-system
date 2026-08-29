import React, { useState, useMemo, useEffect } from 'react'
import { 
  Store, Key, TrendingUp, Activity, Calendar, ShoppingCart, 
  ShieldCheck, HandCoins, Package, Building, TrendingDown, Loader2 
} from 'lucide-react'
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dbStats, setDbStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. DYNAMIC MONTH GENERATOR ---
  const months = useMemo(() => {
    const list = [];
    const systemLaunchDate = new Date(2026, 7, 1); 
    const today = new Date(); 
    let rollingDate = new Date(systemLaunchDate);
    while (rollingDate <= today) {
      const monthName = rollingDate.toLocaleString('default', { month: 'long' });
      const year = rollingDate.getFullYear();
      list.unshift(`${monthName} ${year}`); 
      rollingDate.setMonth(rollingDate.getMonth() + 1);
    }
    if (list.length === 0) list.push("August 2026");
    return list;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const role = storeUser ? "store" : "admin";

  // --- 2. FETCH STATS ---
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/dashboard/stats`, {
          params: { month: selectedMonth, role: role, storeId: storeUser?._id }
        });
        setDbStats(res.data.stats);
      } catch (err) {
        toast.error("Dashboard sync failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [selectedMonth, role]);

  // --- 3. STATS MAPPING ---
  const adminStats = [
    { label: "Total Stores", count: dbStats?.totalStores || "0", icon: <Store size={22} />, color: "#13786E", bg: "bg-teal-50", desc: "Live Outlets" },
    { label: "Monthly Rent", count: `Rs. ${(dbStats?.monthlyRent || 0).toLocaleString()}`, icon: <Key size={22} />, color: "#3B82F6", bg: "bg-blue-50", desc: "Expected" },
    { label: "Total Revenue", count: `Rs. ${(dbStats?.totalRevenue || 0).toLocaleString()}`, icon: <TrendingUp size={22} />, color: "#10B981", bg: "bg-emerald-50", desc: "Collected Rent" },
    { label: "Defaulters", count: dbStats?.defaulters || "0", icon: <Activity size={22} />, color: "#EF4444", bg: "bg-red-50", desc: "Action Required" }
  ];

  const storeStats = [
    { label: "Total Revenue", count: `Rs. ${(dbStats?.totalRevenue || 0).toLocaleString()}`, icon: <TrendingUp size={22}/>, color: "#10B981", bg: "bg-emerald-50", desc: "Gross Value" },
    { label: "Net Profit", count: `Rs. ${(dbStats?.netProfit || 0).toLocaleString()}`, icon: <TrendingUp size={22}/>, color: "#13786E", bg: "bg-teal-50", desc: "Est. Margin" },
    { label: "Total Debt", count: `Rs. ${(dbStats?.totalDebt || 0).toLocaleString()}`, icon: <HandCoins size={22}/>, color: "#EF4444", bg: "bg-red-50", desc: "Customer Udhaar" },
    { label: "Stock Items", count: (dbStats?.totalProducts || 0).toLocaleString(), icon: <Package size={22}/>, color: "#8B5CF6", bg: "bg-purple-50", desc: "Total SKU" },
    { label: "Agencies", count: dbStats?.totalAgencies || "0", icon: <Building size={22}/>, color: "#64748B", bg: "bg-slate-50", desc: "Suppliers" },
    { label: "Active Portal Login", count: "Secure", icon: <ShieldCheck size={22}/>, color: "#3B82F6", bg: "bg-blue-50", desc: "Current Session" },
    { label: "Total Orders", count: dbStats?.totalOrders || "0", icon: <ShoppingCart size={22}/>, color: "#F59E0B", bg: "bg-yellow-50", desc: "Processed" },
    { label: "Total Wholesalers", count: dbStats?.totalWholesalers || "0", icon: <Building size={22}/>, color: "#EC4899", bg: "bg-pink-50", desc: "Registered" },
  ];

  const currentStats = role === "admin" ? adminStats : storeStats;

  return (
    // Responsive margin-left: Mobile (0), Large Screens (64/16rem)
    <div className='flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans transition-all duration-300'>
      
      {/* Header Section: Stack on mobile, Row on md+ */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6'>
        <div className="text-center md:text-left">
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3'>
            {role === "admin" ? "Admin Control" : `${storeUser?.name} Terminal`}
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1'>
            {isLoading ? "Fetching real-time data..." : `Reporting for ${selectedMonth}`}
          </p>
        </div>

        {/* STATUS BADGE - TOP CENTER */}
        {role === "store" && !isLoading && dbStats?.storeStatus && (
          <div className="flex-1 flex justify-center">
            <div className={`px-6 py-2 rounded-2xl border-2 flex items-center gap-2 shadow-sm ${
              dbStats.storeStatus === 'Active' ? 'bg-green-50 border-green-200 text-green-700' :
              dbStats.storeStatus === 'Defaulter' ? 'bg-red-50 border-red-200 text-red-700 animate-pulse' :
              dbStats.storeStatus === 'Warning' ? 'bg-orange-50 border-orange-200 text-orange-700' :
              'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
              <ShieldCheck size={18} />
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Store Status</span>
                 <span className="text-sm font-black uppercase tracking-widest">{dbStats.storeStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC MONTH SELECTOR: Full width on mobile */}
        <div className='bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm items-center px-4 w-full md:w-auto hover:border-[#13786E] transition-all'>
          <Calendar size={16} className="text-[#13786E]" />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            className='bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 md:py-2.5 pl-2 flex-1 md:w-48'
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards Grid: 1 col (xs), 2 col (sm), 3/4 col (lg) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-6`}>
        {isLoading ? (
          // Loading Skeletons
          [...Array(role === 'admin' ? 4 : 6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] h-32 animate-pulse border border-gray-100 shadow-sm" />
          ))
        ) : (
          currentStats.map((item, idx) => (
            <div key={idx} className='group bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden active:scale-95'>
              <div className='flex items-center gap-4 md:gap-5 relative z-10'>
                <div className={`${item.bg} p-3 md:p-3.5 rounded-2xl transition-all group-hover:rotate-6 shadow-inner`} style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className='overflow-hidden'>
                  <h3 className='text-gray-400 font-black text-[9px] uppercase tracking-widest truncate'>{item.label}</h3>
                  <p className='text-lg md:text-xl font-black text-gray-800 truncate tracking-tighter mt-0.5'>{item.count}</p>
                </div>
              </div>
              <div className='mt-5 pt-4 border-t border-gray-50 flex items-center justify-between'>
                <span className='text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic'>{item.desc}</span>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sync Status Footer - Only on larger screens or centered on mobile */}
      {!isLoading && (
        <div className="mt-10 flex justify-center opacity-50">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 shadow-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            System Fully Synchronized
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;