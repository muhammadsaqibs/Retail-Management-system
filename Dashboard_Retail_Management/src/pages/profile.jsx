import React, { useState, useEffect } from "react";
import { 
  User, MapPin, Phone, Mail, Save, 
  Camera, ShieldCheck, RefreshCw, Briefcase, 
  CheckCircle2, Loader2 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "Administrator"
  });

  // --- 1. FETCH CURRENT PROFILE DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        const user = res.data?.user;
        if (user) {
          setProfileData({
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            role: user.role || "Administrator"
          });
        }
      } catch (error) {
        console.error("Profile Fetch Error");
      }
    };
    fetchProfile();
  }, []);

  // --- 2. UPDATE PROFILE HANDLER ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.username || !profileData.phone) {
      return toast.error("Name and Phone are required");
    }

    setIsLoading(true);
    try {
      await axiosInstance.put("/auth/update-profile", {
        username: profileData.username,
        phone: profileData.phone,
        address: profileData.address
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 font-sans text-left text-gray-800 overflow-x-hidden">
      
      {/* Header - Stacks on Mobile */}
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
          <User size={32} className="hidden sm:block" /> Personal Profile
        </h1>
        <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-[2px] md:tracking-[3px] uppercase mt-1">
          Manage your identity and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Profile Preview Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-8 text-center relative overflow-hidden">
            {/* Header Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-24 bg-[#13786E]/5"></div>
            
            <div className="relative z-10">
               {/* Avatar */}
               <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-[#13786E] mx-auto mb-4 flex items-center justify-center text-white shadow-xl relative group">
                  <User size={40} md:size={48} />
                  <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-[#13786E] hover:scale-110 transition-transform border border-gray-100">
                    <Camera size={16}/>
                  </button>
               </div>
               
               <h2 className="text-xl font-black tracking-tight truncate px-2">{profileData.username || "User Name"}</h2>
               <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-4 py-1.5 rounded-full mt-2 inline-block border border-teal-100">
                 {profileData.role}
               </p>

               <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                     <Mail size={16} className="text-[#13786E] flex-shrink-0"/>
                     <span className="text-xs font-bold text-gray-500 truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                     <Phone size={16} className="text-[#13786E] flex-shrink-0"/>
                     <span className="text-xs font-bold text-gray-500 truncate">{profileData.phone || "No Phone Number"}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-gray-900 rounded-[2rem] p-6 text-white shadow-xl shadow-gray-200">
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={20} className="text-teal-400"/>
                <h3 className="font-black text-xs uppercase tracking-widest">Verified Session</h3>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
               Your account is protected by hardware-level encryption. Profile updates are synchronized across all store terminals instantly.
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10 h-full">
            <h3 className="text-[11px] md:text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-gray-50 pb-4">
              <CheckCircle2 size={18} className="text-[#13786E]"/> Edit Profile Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} className="text-[#13786E]"/> Full Identity Name
                  </label>
                  <input 
                    type="text" value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all shadow-inner"
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Phone size={14} className="text-[#13786E]"/> Contact Number
                  </label>
                  <input 
                    type="text" value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all shadow-inner"
                  />
                </div>

                {/* Email (Disabled) */}
                <div className="space-y-2 opacity-80">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail size={14} className="text-gray-300"/> Login Email (Read Only)
                  </label>
                  <input 
                    type="email" value={profileData.email} disabled
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-400 cursor-not-allowed italic"
                  />
                </div>

                {/* Role (Disabled) */}
                <div className="space-y-2 opacity-80">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-300"/> Account Role
                  </label>
                  <input 
                    type="text" value={profileData.role} disabled
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-400 cursor-not-allowed italic"
                  />
                </div>

                {/* Address Input (Full Width) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#13786E]"/> Home / Work Address
                  </label>
                  <textarea 
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Full residential or shop address details..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all h-32 resize-none shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button - Center on Mobile, End on Desktop */}
              <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-end">
                 <button 
                   type="submit" disabled={isLoading}
                   className="w-full sm:w-auto bg-[#13786E] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[2px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-teal-700"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                   Save Profile Changes
                 </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;