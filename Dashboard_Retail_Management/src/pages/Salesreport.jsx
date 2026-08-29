import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Calendar, CreditCard, DollarSign, Package, 
  Activity, ArrowUpRight, CheckCircle2, ChevronRight, BarChart4
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Salesreport = () => {
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const role = storeUser ? "store" : "admin";
  
  // Fetch local orders for Store
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("apex_orders_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate Insights
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Delivered");
    
    let totalRevenue = 0;
    let totalItems = 0;
    let cashSales = 0;
    let cardSales = 0;
    let onlineSales = 0;

    completedOrders.forEach(ord => {
      totalRevenue += Number(ord.amount || 0);
      ord.items?.forEach(i => totalItems += Number(i.qty || 0));
      
      if (ord.payment === "Cash" || !ord.payment) cashSales += Number(ord.amount || 0);
      else if (ord.payment === "Card") cardSales += Number(ord.amount || 0);
      else if (ord.payment === "Online") onlineSales += Number(ord.amount || 0);
    });

    return {
      totalRevenue,
      totalOrders: completedOrders.length,
      totalItems,
      cashSales,
      cardSales,
      onlineSales,
      recentSales: completedOrders.slice(0, 15) // Top 15 recent
    };
  }, [orders]);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 font-sans text-left overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
            <TrendingUp className="hidden sm:block" size={32} /> Sales Analytics
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
            Real-time Revenue & Transaction Insights
          </p>
        </div>
      </div>

      {role === "admin" ? (
         <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center shadow-sm">
            <BarChart4 size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Admin Sales Overview</h2>
            <p className="text-sm text-gray-400 font-medium mt-2">Sales insights are available at the store terminal level. Please log in as a store to view detailed POS transaction analytics.</p>
         </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <DollarSign size={64} />
               </div>
               <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                     <TrendingUp size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Revenue</h3>
               </div>
               <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
                  Rs. {stats.totalRevenue.toLocaleString()}
               </h2>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Activity size={64} />
               </div>
               <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                     <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed Sales</h3>
               </div>
               <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
                  {stats.totalOrders.toLocaleString()} <span className="text-sm text-gray-400 font-bold tracking-normal uppercase">Orders</span>
               </h2>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Package size={64} />
               </div>
               <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                     <Package size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Units Sold</h3>
               </div>
               <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
                  {stats.totalItems.toLocaleString()} <span className="text-sm text-gray-400 font-bold tracking-normal uppercase">Items</span>
               </h2>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Methods</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="flex items-center gap-2 text-gray-500"><DollarSign size={14} className="text-green-500"/> Cash</span>
                     <span className="text-gray-800">Rs. {stats.cashSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="flex items-center gap-2 text-gray-500"><CreditCard size={14} className="text-blue-500"/> Card</span>
                     <span className="text-gray-800">Rs. {stats.cardSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="flex items-center gap-2 text-gray-500"><ArrowUpRight size={14} className="text-orange-500"/> Online</span>
                     <span className="text-gray-800">Rs. {stats.onlineSales.toLocaleString()}</span>
                  </div>
               </div>
            </div>

          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
               <div>
                 <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Recent Transactions</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Latest 15 completed sales</p>
               </div>
               <div className="bg-teal-50 text-[#13786E] p-3 rounded-2xl">
                  <Calendar size={20} />
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <tr>
                        <th className="px-6 md:px-8 py-5">Date & Time</th>
                        <th className="px-6 md:px-8 py-5">Order ID</th>
                        <th className="px-6 md:px-8 py-5">Customer</th>
                        <th className="px-6 md:px-8 py-5">Payment</th>
                        <th className="px-6 md:px-8 py-5 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                     {stats.recentSales.length > 0 ? (
                        stats.recentSales.map((sale, idx) => (
                           <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                              <td className="px-6 md:px-8 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700">{new Date(sale.date).toLocaleDateString()}</span>
                                    <span className="text-[10px] text-gray-400 font-black uppercase">{new Date(sale.date).toLocaleTimeString()}</span>
                                 </div>
                              </td>
                              <td className="px-6 md:px-8 py-4 font-black text-[#13786E] text-sm">{sale.id}</td>
                              <td className="px-6 md:px-8 py-4 font-bold text-gray-700 text-sm">{sale.customer}</td>
                              <td className="px-6 md:px-8 py-4">
                                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                                    sale.payment === 'Cash' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    sale.payment === 'Card' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                    'bg-orange-50 text-orange-700 border-orange-200'
                                 }`}>
                                    {sale.payment || "Cash"}
                                 </span>
                              </td>
                              <td className="px-6 md:px-8 py-4 font-black text-gray-800 text-sm text-right">
                                 Rs. {Number(sale.amount).toLocaleString()}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5" className="p-16 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-300">
                                 <Activity size={48} className="mb-4 opacity-50" />
                                 <p className="font-black uppercase tracking-[4px] text-xs italic">No sales recorded yet</p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Salesreport