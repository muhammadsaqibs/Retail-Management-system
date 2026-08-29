import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Key, MessageSquare, TrendingDown, TrendingUp,
  Crown, ShieldCheck, LogOut, Package, Grid2X2, ReceiptCent,
  Users, Truck, Building, GitBranch, UserCheck, Lock, 
  ShoppingCart, HandCoins, X
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  const user = authData?.user || authData;
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const role = storeUser ? "store" : (user?.role === "admin" ? "admin" : "admin");

  const displayBrandName = role === "store" ? storeUser?.name : "Apexiums";
  const isActive = (path) => location.pathname.replace(/\/$/, '') === path.replace(/\/$/, '');

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (role === "admin") await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("activeStore");
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/admin/signUp");
    }
  });

  const adminLinks = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/dashboard" },
    { label: "Stores", icon: <Store size={20} />, to: "/admin/store" },
    { label: "Rent", icon: <Key size={20} />, to: "/admin/rent" },
    { label: "Messages", icon: <MessageSquare size={20} />, to: "/admin/messages" },
    { label: "Expense", icon: <TrendingDown size={20} />, to: "/admin/expense" },
    { label: "Revenue", icon: <TrendingUp size={20} />, to: "/admin/revenue" },
    { label: "Customer Status", icon: <Crown size={20} />, to: "/admin/customerstatus" },
  ];

  const storeGroups = [
    { group: "Main", links: [{ label: "Dashboard", icon: <LayoutDashboard size={18}/>, to: "/admin/dashboard" }, { label: "Billing", icon: <ReceiptCent size={18}/>, to: "/admin/billing" }] },
    { group: "Inventory", links: [{ label: "Products", icon: <Package size={18}/>, to: "/admin/products" }, { label: "Categories", icon: <Grid2X2 size={18}/>, to: "/admin/categories" }] },
    { group: "Sales & Orders", links: [{ label: "Orders", icon: <ShoppingCart size={18}/>, to: "/admin/orders" }, { label: "Sales", icon: <TrendingUp size={18}/>, to: "/admin/sales-reports" }, { label: "Customers", icon: <Users size={18}/>, to: "/admin/customers" }, { label: "Debt / Udhaar", icon: <HandCoins size={18}/>, to: "/admin/debt" }] },
    { group: "Partners", links: [{ label: "Whole Sellers", icon: <Truck size={18}/>, to: "/admin/wholesalers" }, { label: "Agencies", icon: <Building size={18}/>, to: "/admin/agencies" }] },
    { group: "Management", links: [{ label: "Staff", icon: <UserCheck size={18}/>, to: "/admin/staff" }, { label: "Permissions", icon: <Lock size={18}/>, to: "/admin/permissions" }, { label: "Expense", icon: <TrendingDown size={18}/>, to: "/admin/expense" }, { label: "Revenue", icon: <TrendingUp size={18}/>, to: "/admin/revenue" }] }
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-[#13786E] text-white flex flex-col border-r border-teal-700 shadow-xl z-[999] transition-all duration-300
        w-64 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl shadow-inner text-white">
              {role === "store" ? <Store size={22} /> : <LayoutDashboard size={22} />}
            </div>
            <div className="overflow-hidden">
              <h1 className="font-black text-base uppercase truncate w-32 tracking-tighter" title={displayBrandName}>{displayBrandName}</h1>
              <p className="text-[8px] text-teal-300 font-bold uppercase tracking-widest opacity-80">{role === "admin" ? "Global Admin" : "Official Store"}</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar space-y-6">
          {role === "admin" ? (
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <SidebarLink key={link.to} link={link} active={isActive(link.to)} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
          ) : (
            storeGroups.map((group, idx) => (
              <div key={idx}>
                <h2 className="px-4 text-[9px] font-black text-teal-400 uppercase tracking-[2px] mb-2 opacity-60">{group.group}</h2>
                <div className="space-y-1">
                  {group.links.map((link) => (
                    <SidebarLink key={link.to} link={link} active={isActive(link.to)} onClick={() => setMobileOpen(false)} />
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="pt-4 border-t border-teal-800/50">
            <SidebarLink link={{ label: "Account Security", icon: <ShieldCheck size={18} />, to: "/admin/settings" }} active={isActive("/admin/settings")} onClick={() => setMobileOpen(false)} />
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-teal-800 bg-teal-900/30">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-teal-100 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Sign Out Terminal</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </>
  );
};

const SidebarLink = ({ link, active, onClick }) => (
  <Link
    to={link.to}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
      ${active ? "bg-white text-[#13786E] shadow-lg font-bold" : "hover:bg-white/10 text-teal-50"}`}
  >
    <span className={`${active ? "text-[#13786E]" : "text-teal-300 group-hover:text-white"}`}>{link.icon}</span>
    <span className="text-xs tracking-tight">{link.label}</span>
    {active && <span className="absolute right-2 w-1.5 h-1.5 bg-[#13786E] rounded-full" />}
  </Link>
);

export default Sidebar;