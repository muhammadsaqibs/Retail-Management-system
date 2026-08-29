import React, { useState, useEffect } from "react";
import { 
  Store, Plus, Edit2, Trash2, MapPin, Search, X, 
  User, Tag, Phone, Mail, DollarSign, Calendar, Lock, Eye, EyeOff,
  Loader2, CheckCircle
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const emptyStore = { 
    name: "", owner: "", address: "", shopType: "", 
    contact: "", email: "", password: "", 
    monthlyRent: "", 
    createdAt: new Date().toISOString().split('T')[0], 
    status: "Active" 
  };

  const [currentStore, setCurrentStore] = useState(emptyStore);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/stores/all");
      // Backend common pattern handling
      setStores(res.data.data || res.data || []);
    } catch (error) {
      toast.error("Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axiosInstance.put(`/stores/update/${id}`, { status: newStatus });
      setStores(stores.map(s => s._id === id ? { ...s, status: newStatus } : s));
      
      if(newStatus === "Active") toast.success("Store Activated");
      else toast.warn("Store Inactivated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleChange = (e) => {
    setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
  };

  const openModal = (store = emptyStore) => {
    setCurrentStore(store);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentStore.name || !currentStore.owner || !currentStore.contact || !currentStore.password) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentStore._id) {
        const res = await axiosInstance.put(`/stores/update/${currentStore._id}`, currentStore);
        const updated = res.data.data || res.data;
        setStores(stores.map((s) => (s._id === currentStore._id ? updated : s)));
        toast.success("Store updated successfully");
      } else {
        const res = await axiosInstance.post("/stores/add", currentStore);
        const newData = res.data.data || res.data;
        setStores([newData, ...stores]);
        toast.success("New store created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const deleteStore = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await axiosInstance.delete(`/stores/delete/${id}`);
        setStores(stores.filter((s) => s._id !== id));
        toast.info("Store removed");
      } catch (error) {
        toast.error("Failed to delete store");
      }
    }
  };

  const filteredStores = stores.filter((s) =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.owner || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 lg:ml-64 ml-0 p-4 md:p-8 bg-gray-50 min-h-screen mt-14 font-sans text-left text-gray-800 overflow-x-hidden">
      
      {/* Header - Stacks on Mobile */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 border-b pb-6 border-gray-200">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center lg:justify-start gap-3">
            <Store className="hidden sm:block" size={32} /> Store Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
            Control Panel for Retail Partners
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full lg:w-auto bg-[#13786E] hover:bg-[#0e5a52] text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 font-black uppercase tracking-widest text-[10px] transition-all"
        >
          <Plus size={18} /> Add New Store
        </button>
      </div>

      {/* Search Bar - Responsive */}
      <div className="bg-white p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400 flex-shrink-0" size={20} />
        <input
          type="text"
          placeholder="Search by store name or owner..."
          className="w-full outline-none text-gray-700 bg-transparent font-bold text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section - Horizontal Scroll for Mobile */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl shadow-md overflow-hidden border border-gray-100 mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Store / Owner</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Type / Contact</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Credentials</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Active Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                     <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-[#13786E]" size={32} />
                        <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Syncing Store Cloud...</span>
                     </div>
                   </td>
                </tr>
              ) : filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <tr key={store._id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{store.name}</span>
                        <span className="text-[11px] text-[#13786E] font-black uppercase tracking-tighter italic">Owner: {store.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{store.shopType}</span>
                        <span className="text-gray-400 font-bold tracking-tighter">{store.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-500 lowercase underline">{store.email}</span>
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">PASS: ••••••••</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => toggleStatus(store._id, store.status)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                            store.status === "Active" ? "bg-[#13786E]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                              store.status === "Active" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${store.status === 'Active' ? 'text-[#13786E]' : 'text-gray-400'}`}>
                          {store.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(store)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"><Edit2 size={16} /></button>
                        <button onClick={() => deleteStore(store._id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                     No stores matching your search
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL - Fully Responsive Layout --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4 font-sans">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <Store size={22}/> {currentStore._id ? "Edit Terminal" : "Register Store"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <FormInput label="Store Name *" name="name" icon={<Store size={14}/>} value={currentStore.name} onChange={handleChange} required placeholder="Apexiums Outlets" />
                <FormInput label="Owner Name *" name="owner" icon={<User size={14}/>} value={currentStore.owner} onChange={handleChange} required />
                
                <div className="md:col-span-2">
                  <FormInput label="Full Address *" name="address" icon={<MapPin size={14}/>} value={currentStore.address} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Tag size={14} className="text-[#13786E]"/> Business Type
                   </label>
                   <select 
                     name="shopType" value={currentStore.shopType} onChange={handleChange}
                     className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#13786E] outline-none bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner"
                   >
                     <option value="">Select Type</option>
                     <option value="Pharmacy">Pharmacy</option>
                     <option value="Superstore">Superstore</option>
                     <option value="Restaurant">Restaurant</option>
                     <option value="Fashion">Fashion Wear</option>
                   </select>
                </div>

                <FormInput label="Mobile Contact *" name="contact" icon={<Phone size={14}/>} value={currentStore.contact} onChange={handleChange} required />
                
                <FormInput label="Login ID / Email *" name="email" type="email" icon={<Mail size={14}/>} value={currentStore.email} onChange={handleChange} required />
                
                <div className="relative">
                    <FormInput 
                      label="Store Password *" name="password" 
                      type={showPass ? "text" : "password"} 
                      icon={<Lock size={14}/>} value={currentStore.password} 
                      onChange={handleChange} 
                      required
                    />
                    <button 
                        type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-11 text-gray-400 hover:text-[#13786E] transition-colors"
                    >
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>

                <FormInput label="Monthly Rent (Rs)" name="monthlyRent" type="number" icon={<DollarSign size={14}/>} value={currentStore.monthlyRent} onChange={handleChange} />
                <FormInput label="Contract Date" name="createdAt" type="date" icon={<Calendar size={14}/>} value={currentStore.createdAt} onChange={handleChange} />
              </div>

              <div className="pt-8 border-t flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:bg-teal-700 flex items-center justify-center gap-2">
                   <CheckCircle size={16}/> Save Store Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// Internal Sub-component for Inputs
const FormInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input 
      {...props} 
      className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#13786E] outline-none transition-all bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
    />
  </div>
);

export default StoreManagement;