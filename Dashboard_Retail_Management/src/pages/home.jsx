import React from 'react'
import { BarChart3, Users, Package, FileText, Bell, Settings, ArrowRight } from "lucide-react";

const Home = () => {
  const sections = [
    {
      icon: <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />,
      title: "Sales Overview",
      desc: "Monitor your store’s overall performance. View total revenue, daily and monthly sales, and insights.",
      color: "bg-indigo-50/50 border-indigo-100 hover:border-indigo-300",
    },
    {
      icon: <Users className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />,
      title: "Customer Insights",
      desc: "Track active users and growing customer base. Analyze behavior to improve engagement.",
      color: "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300",
    },
    {
      icon: <Package className="w-7 h-7 md:w-8 md:h-8 text-orange-500" />,
      title: "Product Performance",
      desc: "Identify top-selling items and low-stock alerts. Keep your inventory organized efficiently.",
      color: "bg-orange-50/50 border-orange-100 hover:border-orange-300",
    },
    {
      icon: <FileText className="w-7 h-7 md:w-8 md:h-8 text-blue-500" />,
      title: "Orders & Reports",
      desc: "Access recent orders and generate detailed sales reports with comprehensive analytics.",
      color: "bg-blue-50/50 border-blue-100 hover:border-blue-300",
    },
    {
      icon: <Bell className="w-7 h-7 md:w-8 md:h-8 text-pink-500" />,
      title: "Notifications",
      desc: "Stay informed with real-time alerts for new orders, feedback, or inventory restocks.",
      color: "bg-pink-50/50 border-pink-100 hover:border-pink-300",
    },
    {
      icon: <Settings className="w-7 h-7 md:w-8 md:h-8 text-gray-500" />,
      title: "Account Settings",
      desc: "Manage preferences, roles, and configurations. Fine-tune your dashboard appearance.",
      color: "bg-gray-50/50 border-gray-200 hover:border-gray-400",
    },
  ];

  return (
    // lg:ml-64 Sidebar ke liye space chorta hai, mobile par full width ho jata hai
    <div className='flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 font-sans text-left overflow-x-hidden'>
      
      {/* Page Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase italic">
          Admin Dashboard
        </h1>
        <div className="h-1 w-20 bg-[#13786E] mx-auto lg:mx-0 mt-2 rounded-full"></div>
        <p className="text-gray-500 mt-4 max-w-2xl text-sm md:text-base font-medium leading-relaxed">
          Welcome back, Admin 👋 — here is a complete overview of your retail ecosystem. 
          Monitor performance, manage stock, and track growth in real-time.
        </p>
      </div>

      {/* Section Cards Grid - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`${section.color} p-6 rounded-[2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group active:scale-95`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white p-3 rounded-2xl shadow-inner group-hover:rotate-6 transition-transform">
                {section.icon}
              </div>
              <h2 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">
                {section.title}
              </h2>
            </div>
            
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium flex-1">
              {section.desc}
            </p>

            <div className="mt-5 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#13786E] transition-colors">
                    Access Module
                </span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-[#13786E] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Quick Tips / System Status Footer */}
      <div className="mt-12 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Status: All Systems Operational</span>
        </div>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[4px]">
           Apexiums Retail Management System v2.0
        </p>
      </div>

    </div>
  )
}

export default Home;