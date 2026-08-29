import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Loader2, Activity, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // --- 1. DYNAMIC MONTHS LIST (Current month on top) ---
  const generateMonths = () => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 24; i++) {
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      months.push(`${monthName} ${year}`);
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };
  
  const monthsList = useMemo(() => generateMonths(), []);
  const [selectedMonth, setSelectedMonth] = useState(monthsList[0]);

  // --- 2. FETCH ANALYTICS ---
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/revenue/stats?month=${selectedMonth}`);
      let newStats = res.data;

      const storeUser = JSON.parse(localStorage.getItem("activeStore"));
      if (storeUser) {
        const localOrders = JSON.parse(localStorage.getItem("apex_orders_list") || "[]");
        const completedOrders = localOrders.filter(o => o.status === "Completed" || o.status === "Delivered");
        
        let localRevenue = 0;
        completedOrders.forEach(ord => localRevenue += Number(ord.amount || 0));

        newStats = {
          ...newStats,
          totalRevenue: localRevenue,
          netProfit: localRevenue * 0.4, // Fixed 40% margin estimate for POS
          avgOrderValue: completedOrders.length > 0 ? (localRevenue / completedOrders.length).toFixed(2) : 0
        };
      }

      setStats(newStats);
    } catch (error) {
      console.error("Analytics Fetch Error");
      toast.error("Failed to load financial records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth]);

  // Loading State - Responsive Centering
  if (isLoading) return (
    <div className="flex-1 lg:ml-64 ml-0 h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className="animate-spin text-[#13786E]" size={40} />
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest text-center'>Syncing Financial Ecosystem...</p>
      </div>
    </div>
  );

  return (
    <div className='flex-1 lg:ml-64 ml-0 min-h-screen mt-14 bg-[#F8FAFC] p-4 md:p-8 text-left font-sans overflow-x-hidden'>
      
      {/* Header Section - Stack on mobile */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div className="text-center md:text-left">
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3'>
            <BarChart3 className="text-[#13786E]" /> Revenue Analytics
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1'>
            Detailed breakdown for {selectedMonth}
          </p>
        </div>
        
        {/* MONTH SELECTOR - Full width on mobile */}
        <div className='bg-white border border-gray-200 p-1.5 rounded-2xl flex items-center shadow-sm px-4 w-full md:w-auto'>
          <Calendar size={16} className="text-[#13786E]" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-2.5 pl-2 flex-1 md:w-48"
          >
            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Top Stats Cards - Grid Layout (1 col on mobile, 3 on desktop) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10'>
        <StatCard 
          title="Gross Revenue" 
          amount={`Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`} 
          percentage="+14.2%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
        <StatCard 
          title="Average Entry" 
          amount={`Rs. ${stats?.avgOrderValue || 0}`} 
          percentage="Fixed" 
          isUp={true} 
          icon={<TrendingUp size={22}/>} 
        />
        <StatCard 
          title="Net Profit Margin" 
          amount={`Rs. ${stats?.netProfit?.toLocaleString() || 0}`} 
          percentage="+5.7%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
      </div>

      {/* Charts Section - Grid Stacking */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        
        {/* Main Trend Chart (2/3 width on desktop) */}
        <div className='lg:col-span-2 bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10'>
            <div>
              <h3 className='font-black text-gray-800 text-sm uppercase tracking-widest'>Performance Trend</h3>
              <p className='text-[10px] text-gray-400 font-bold uppercase mt-1 italic'>Real-time Visualization</p>
            </div>
            <div className='flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter'>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#13786E] rounded-full'></span> Revenue</div>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-teal-300 rounded-full'></span> Profit</div>
            </div>
          </div>
          
          {/* Chart Responsive Container */}
          <div className='h-[250px] md:h-[350px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13786E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#13786E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#13786E" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#5EEAD4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit / Summary Box - Responsive Stacking */}
        <div className='bg-white p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center'>
            <div className='bg-teal-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-[#13786E] shadow-inner'>
               <Activity size={30} />
            </div>
            <h4 className='text-xl font-black text-gray-800 leading-tight uppercase tracking-tighter'>Audit Summary</h4>
            <p className='text-xs text-gray-400 font-bold mt-4 leading-relaxed px-2'>
               Your data indicates consistent stability in {selectedMonth}. Current margins suggest a healthy balance between operations and profit.
            </p>
            
            <div className='mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3'>
                <button className='w-full py-3 bg-gray-50 rounded-xl text-[9px] font-black text-[#13786E] uppercase tracking-[2px] hover:bg-teal-50 transition-colors'>
                    Export PDF Report
                </button>
                <button className='w-full py-3 text-[9px] font-black text-gray-400 uppercase tracking-[2px] hover:underline'>
                    Print Analytics
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

// Internal StatCard Component - Optimized for small screens
const StatCard = ({ title, amount, percentage, isUp, icon }) => (
  <div className='bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group active:scale-95'>
    <div className='flex items-center justify-between mb-5'>
      <div className='bg-gray-50 group-hover:bg-teal-50 p-3.5 rounded-2xl text-[#13786E] shadow-inner transition-colors'>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[9px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-lg`}>
        {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
        {percentage}
      </div>
    </div>
    <div className="overflow-hidden">
      <h3 className='text-gray-400 text-[10px] font-black uppercase tracking-widest truncate'>{title}</h3>
      <p className='text-xl md:text-2xl font-black text-gray-800 mt-1 tracking-tighter truncate'>{amount}</p>
    </div>
  </div>
);

export default Revenue;