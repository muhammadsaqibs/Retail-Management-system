import React, { useState } from 'react' // useState add kiya
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react'; 
import 'react-toastify/dist/ReactToastify.css'; 

import axiosInstance from './lib/axios.js';
import Sidebar from './components/sideBar.jsx';
import Header from './components/Header.jsx';

// Pages
import SignUp from './pages/signUp.jsx'
import Dashboard from './pages/Dashboard.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Users from './pages/Users.jsx';
import Staff from './pages/staff.jsx' 
import Categories from './pages/Categories.jsx';
import StockManagement from './pages/StockManagement.jsx';
import ClientReviews from './pages/ClientReviews.jsx';
import Setting from './pages/Settings.jsx';
import SalesReports from './pages/Salesreport'
import About from './pages/About.jsx';
import StockAttendence from './pages/Stock-Attendence.jsx';
import Biling from './pages/Biling.jsx';
import Revenue from './pages/Revenue.jsx';
import Scanner from './pages/Scanner.jsx';
import StoreManagement from './pages/store.jsx';
import MessageCenter from './pages/messageCenter.jsx';
import RentManagement from './pages/Rent.jsx';
import ExpenseManagement from './pages/expense.jsx';
import CustomerStatus from './pages/customerStatus.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/CustomerPage.jsx';
import Profile from './pages/profile.jsx';
import DebtPage from './pages/debit.jsx';
import AgencyPage from './pages/AgencyPage.jsx';
import Branches from './pages/Branches.jsx';

const App = () => {
  const location = useLocation();
  
  // --- MOBILE SIDEBAR STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. Admin Auth Check (Backend se)
  const { data: authData, isLoading: isAdminLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        return res.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  // 2. Store Auth Check (Frontend LocalStorage se)
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));

  // Unified User: Ya to Admin ho ya Store Owner
  const adminUser = authData?.user || authData;
  const user = adminUser || storeUser;

  // Loading state sirf Admin check ke liye zaroori hai
  if (isAdminLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-[#13786E]">
        <div className='flex flex-col items-center gap-4'>
           <Loader className="animate-spin" size={50} />
           <p className='font-bold uppercase tracking-widest text-xs'>Verifying Access...</p>
        </div>
      </div>
    );
  }

  // Sidebar aur Header dikhane ki condition
  const isAuthPage = ["/admin/signUp", "/admin/signin"].includes(location.pathname);
  const showSidebarAndHeader = user && !isAuthPage;

  return (
    <div className='relative flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" /> 
      
      {/* 
          Sidebar logic: 
          isMobileOpen aur setMobileOpen props pass kiye hain responsive behavior ke liye 
      */}
      {showSidebarAndHeader && (
        <Sidebar isMobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      )}

      <main className={`flex-1 flex flex-col min-w-0`}>
        {/* Header mein setMobileOpen pass kiya taake hamburger menu kaam kare */}
        {showSidebarAndHeader && <Header setMobileOpen={setIsSidebarOpen} />}
        
        {/* Routes Container */}
        <div className="flex-1">
          <Routes>
            {/* Public Auth Route */}
            <Route path='/admin/signUp' element={!user ? <SignUp /> : <Navigate to='/admin/dashboard' />} />

            {/* Protected Routes */}
            <Route path='/admin/dashboard' element={user ? <Dashboard /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/products' element={user ? <ProductPage /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/all-users' element={user ? <Users /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/staff' element={user ? <Staff /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/categories' element={user ? <Categories /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/stock' element={user ? <StockManagement /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/client-review' element={user ? <ClientReviews /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/settings' element={user ? <Setting /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/sales-reports' element={user ? <SalesReports /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/about' element={user ? <About /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/staff-attendence' element={user ? <StockAttendence /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/billing' element={user ? <Biling /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/revenue' element={user ? <Revenue /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/scanner' element={user ? <Scanner /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/store' element={user ? <StoreManagement /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/messages' element={user ? <MessageCenter /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/rent' element={user ? <RentManagement /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/expense' element={user ? <ExpenseManagement /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/customerstatus' element={user ? <CustomerStatus /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/profile' element={user ? <Profile /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/agencies' element={user ? <AgencyPage /> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/branches' element={user ? <Branches /> : <Navigate to='/admin/signUp' />} />
            
            <Route path='/admin/orders' element={user ? <Orders/> : <Navigate to='/admin/signUp' />} />
            <Route path='/admin/debt' element={user ? <DebtPage/>: <Navigate to='/admin/signUp' />} />
            <Route path='/admin/customers' element={user ? <Customers/> : <Navigate to='/admin/signUp' />} />
            
            {/* Fallback route */}
            <Route path='*' element={user ? <Navigate to='/admin/dashboard' /> : <Navigate to='/admin/signUp' />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;