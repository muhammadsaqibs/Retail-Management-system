import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ShieldCheck, HandCoins, 
  Package, ShoppingCart, Users, Building, 
  Barcode, Calendar, LayoutDashboard, ArrowRight
} from 'lucide-react';

const StoreDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("August 2024");

  // Store data from localStorage
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));

  // Dummy Stats for Frontend Simulation
  const stats = [
    { label: "Total Revenue", count: "Rs. 1.2M", icon: <TrendingUp size={24}/>, color: "#10B981", bg: "bg-emerald-50", desc: "Overall Earnings" },
    { label: "Net Profit", count: "Rs. 450k", icon: <TrendingUp size={24}/>, color: "#13786E", bg: "bg-teal-50", desc: "After Expenses" },
    { label: "Active Portal Login", count: "1 Active", icon: <ShieldCheck size={24}/>, color: "#3B82F6", bg: "bg-blue-50", desc: "Session Secure" },
    { label: "Total Debt (Udhaar)", count: "Rs. 85k", icon: <HandCoins size={24}/>, color: "#EF4444", bg: "bg-red-50", desc: "Pending Recovery" },
    { label: "Total Products", count: "1,420", icon: <Package size={24}/>, color: "#8B5CF6", bg: "bg-purple-50", desc: "In Inventory" },
    { label: "Total Expense", count: "Rs. 120k", icon: <TrendingDown size={24}/>, color: "#F59E0B", bg: "bg-amber-50", desc: "Maintenance & Bills" },
    { label: "Total Orders", count: "852", icon: <ShoppingCart size={24}/>, color: "#06B6D4", bg: "bg-cyan-50", desc: "Monthly Sales" },
    { label: "Total Staff", count: "12", icon: <Users size={24}/>, color: "#EC4899", bg: "bg-pink-50", desc: "Active Employees" },
    { label: "Total Agencies", count: "08", icon: <Building size={24}/>, color: "#64748B", bg: "bg-slate-50", desc: "Supply Partners" },
  ];

  return (
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 text-left font-sans'>
      
      {/* Header with Month Selector */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter uppercase italic'>
            {storeUser?.name || "Store"} Dashboard
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase'>Branch Performance Overview</p>
        </div>

        {/* Month Selector */}
        <div className='bg-white border border-gray-200 p-2 rounded-2xl flex items-center gap-3 shadow-sm'>
          <Calendar size={18} className="text-[#13786E] ml-2" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='bg-transparent outline-none text-xs font-black uppercase tracking-widest cursor-pointer pr-4'
          >
            <option value="August 2024">August 2024</option>
            <option value="July 2024">July 2024</option>
            <option value="June 2024">June 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Grid - 9 Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10'>
        {stats.map((item, idx) => (
          <div 
            key={idx} 
            className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden'
          >
            <div className='flex items-center gap-5 relative z-10'>
              <div className={`${item.bg} p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-inner`} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className='overflow-hidden'>
                <h3 className='text-gray-400 font-black text-[10px] uppercase tracking-widest truncate'>{item.label}</h3>
                <p className='text-2xl font-black text-gray-800 tracking-tighter mt-1'>{item.count}</p>
              </div>
            </div>
            <div className='mt-5 pt-4 border-t border-gray-50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity'>
               <span className='text-[9px] font-bold uppercase tracking-widest'>{item.desc}</span>
               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: PRINT BARCODE OPTION */}
      <div className='bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden'>
        {/* Background Decoration */}
        <Barcode size={200} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 text-white" />
        
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='bg-teal-500 p-2 rounded-lg'><Barcode size={20} /></div>
            <h2 className='text-xl font-black uppercase tracking-widest'>Barcode System</h2>
          </div>
          <h3 className='text-3xl font-light leading-tight'>Need to label new stock? <br/> <span className='font-black text-teal-400'>Print high-quality barcodes now.</span></h3>
          <p className='text-gray-400 mt-4 text-sm font-medium'>Generate and print unique barcodes for your products for faster billing.</p>
        </div>

        <button className='mt-8 md:mt-0 bg-white text-gray-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-teal-500 hover:text-white transition-all shadow-xl active:scale-95 group'>
          Launch Barcode Printer <ArrowRight size={18} className='group-hover:translate-x-2 transition-transform' />
        </button>
      </div>

    </div>
  );
};

export default StoreDashboard;