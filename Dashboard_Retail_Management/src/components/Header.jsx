import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, User, Settings, LogOut, ChevronDown, CheckCheck, Menu, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const Header = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const { data: notificationData = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notification");
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5 
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-100 z-[99] shadow-sm flex items-center justify-between px-4 md:px-8 transition-all">
      
      {/* Left Section: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Toggle Button for Mobile */}
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Retail / <span className="text-[#13786E]">Terminal Portal</span>
          </h2>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-full transition-all duration-200 relative ${
              showNotifications ? "bg-teal-50 text-[#13786E]" : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Bell size={20} />
            {notificationData.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <span className="font-black text-xs text-gray-800 uppercase tracking-widest">Alerts</span>
                <button className="text-[9px] uppercase font-black text-[#13786E]">Clear All</button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notificationData.length > 0 ? (
                  notificationData.map((notif, idx) => (
                    <div key={idx} className="px-5 py-4 border-b border-gray-50 hover:bg-teal-50/30 transition-colors cursor-pointer group">
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#13786E]">{notif.Title}</h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 font-medium">{notif.Message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-400">
                    <p className="text-xs font-bold italic">No pending notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-2xl hover:bg-gray-50 transition-all"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#13786E] flex items-center justify-center text-white font-black shadow-lg shadow-teal-900/10">
              A
            </div>
            <ChevronDown size={14} className={`text-gray-400 hidden xs:block transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 animate-in slide-in-from-top-2 duration-200">
              <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-[#13786E]">
                <User size={16} /> My Identity
              </Link>
              <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-[#13786E]">
                <Settings size={16} /> Account Key
              </Link>
              <div className="h-[1px] bg-gray-50 my-2 mx-4"></div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;