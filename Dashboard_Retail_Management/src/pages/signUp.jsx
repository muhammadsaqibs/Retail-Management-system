import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Eye, EyeOff, ShieldCheck, 
  Store, Lock, ArrowRight, ArrowLeft 
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loginMode, setLoginMode] = useState("admin");
  const [Showpassword, setShowpassword] = useState(false);
  const [ShowStorePassword, setShowStorePassword] = useState(false);
  
  const [Formdata, setFormdata] = useState({
    identifier: "",
    password: "",
    storeName: "",
    storePassword: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/signup", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Admin Login successful!");
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  });

  const storeLoginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/stores/login", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Welcome to ${data.name} Portal!`);
      localStorage.setItem("activeStore", JSON.stringify({ ...data, role: 'store' }));
      navigate("/admin/dashboard"); 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Store login failed.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginMode === "admin") {
      if (!Formdata.identifier || !Formdata.password) return toast.error("Please enter Admin credentials");
      loginMutation.mutate({ identifier: Formdata.identifier, password: Formdata.password });
    } else {
      if (!Formdata.storeName || !Formdata.storePassword) return toast.error("Please enter Store details");
      storeLoginMutation.mutate({ name: Formdata.storeName, password: Formdata.storePassword });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-white">
      
      {/* LEFT SIDE - Branding Content */}
      <div className="hidden lg:flex w-1/2 bg-[#0e2a27] text-white p-8 lg:p-12 flex-col justify-center items-center relative text-center">
        <div className="max-w-md animate-in fade-in zoom-in duration-700">
          <p className="mb-13">وَاَوْفُوا الْكَيْلَ اِذَا كِلْتُمْ وَزِنُوْا بِالْقِسْطَاسِ الْمُسْتَقِيْمِ</p>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4">
            Apexiums Retail<br />
            <span className="text-[#20b295]">Management Softwares</span>
          </h1>
          
          <p className="text-base text-gray-300 leading-relaxed mb-6 italic opacity-80">
            "We deals in all kind or management software. We are here to help you to make your business full digitilize."
          </p>

          
            
            <div className="flex flex-col items-center gap-1">
               <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Contact us</p>
               <p className="text-2xl font-black text-white bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                 03405542097
               </p>
            </div>
          </div>
         <div className="space-y-4">
            <div className="inline-block bg-[#20b295]/20 border border-[#20b295] px-6 py-2 mt-10 rounded-full text-[#20b295] font-black text-lg uppercase tracking-wider">
              Book A free demo
            </div>
          <div className="mt-10 lg:mt-6 border-t border-white/5 pt-3">
            <p className="text-[13px] text-white font-bold tracking-[3px] uppercase">
              A project of Apexiums Technologies
            </p>
          </div>
        </div>

        {/* --- UPDATED: Floating Official WhatsApp Image --- */}
        <a 
          href="https://wa.me/923405542097" 
          target="_blank" 
          rel="noreferrer"
          className="absolute bottom-6 right-6 hover:scale-110 transition-transform duration-300 active:scale-95 drop-shadow-2xl group"
          title="Chat with Apexiums"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp Support" 
            className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-xl p-0.5"
          />
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
             Live Support
          </span>
        </a>
      </div>

      {/* RIGHT SIDE - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 relative">
        <div className="w-full max-w-sm">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#20b295] p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
              <Building2 size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 leading-none tracking-tighter uppercase">Apexiums</h2>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Management Software</p>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner border border-gray-200">
            <button onClick={() => setLoginMode("admin")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${loginMode === "admin" ? "bg-white text-[#13786E] shadow-sm" : "text-gray-400"}`}>
              <ShieldCheck size={16} /> Admin Access
            </button>
            <button onClick={() => setLoginMode("store")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${loginMode === "store" ? "bg-white text-[#13786E] shadow-sm" : "text-gray-400"}`}>
              <Store size={16} /> Store Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {loginMode === "admin" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email / ID</label>
                  <input type="text" placeholder="example@apex.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm font-medium transition-all" onChange={(e) => setFormdata({ ...Formdata, identifier: e.target.value })} value={Formdata.identifier}/>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input type={Showpassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm font-medium transition-all" onChange={(e) => setFormdata({ ...Formdata, password: e.target.value })} value={Formdata.password}/>
                  <button type="button" onClick={() => setShowpassword(!Showpassword)} className="absolute right-4 top-[34px] text-gray-400">{Showpassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registered Store Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input type="text" placeholder="e.g. A.Biryani" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm font-medium transition-all" onChange={(e) => setFormdata({ ...Formdata, storeName: e.target.value })} value={Formdata.storeName}/>
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Portal Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input type={ShowStorePassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm font-medium transition-all" onChange={(e) => setFormdata({ ...Formdata, storePassword: e.target.value })} value={Formdata.storePassword}/>
                    <button type="button" onClick={() => setShowStorePassword(!ShowStorePassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{ShowStorePassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </>
            )}

            <button
              disabled={loginMutation.isPending || storeLoginMutation.isPending}
              type="submit"
              className="w-full bg-[#13786E] hover:bg-[#0e5a52] text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {(loginMutation.isPending || storeLoginMutation.isPending) ? "Authenticating..." : "Access Dashboard"}
              <ArrowRight size={16} />
            </button>

            <div className="mt-4 text-center pt-4 border-t border-gray-50">
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-2">
                {loginMode === "admin" ? "Are you a store owner?" : "Are you an official admin?"}
              </p>
              <button type="button" onClick={() => setLoginMode(loginMode === "admin" ? "store" : "admin")} className="flex items-center justify-center gap-1 mx-auto text-[#13786E] font-black text-[10px] uppercase hover:underline">
                {loginMode === "admin" ? "Go to Store Portal" : "Switch to Admin Access"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;