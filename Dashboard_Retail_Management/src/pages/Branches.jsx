import React, { useState, useMemo } from "react";
import { 
  Building2, Plus, Trash2, Search, X, 
  MapPin, User, Phone, Eye, RefreshCw, 
  Calendar, Map, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const BranchPage = () => {
  const [activeForm, setActiveForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [viewBranch, setViewBranch] = useState(null);
  const queryClient = useQueryClient();

  // 1. FETCH DATA
  const results = useQueries({
    queries: [
      { queryKey: ['Branches'], queryFn: async () => (await axiosInstance.get('/branches/all')).data }
    ]
  });

  const branches = results[0]?.data?.data || [];
  const isLoading = results[0].isLoading;

  // 2. FORM STATE
  const [branchForm, setBranchForm] = useState({ 
    branchName: "", managerName: "", contact: "", 
    address: "", city: "", status: "Active", openingDate: "" 
  });

  const resetForm = () => {
    setBranchForm({ branchName: "", managerName: "", contact: "", address: "", city: "", status: "Active", openingDate: "" });
  };

  // 3. MUTATIONS
  const createBranch = useMutation({
    mutationFn: (payload) => axiosInstance.post('/branches/add', payload),
    onSuccess: () => { 
      queryClient.invalidateQueries(['Branches']); 
      toast.success("New Branch Registered!"); 
      setActiveForm(false); 
      resetForm(); 
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add branch")
  });

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this branch?")) {
      try {
        await axiosInstance.delete(`/branches/delete/${id}`);
        queryClient.invalidateQueries(['Branches']);
        toast.info("Branch removed");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredBranches = useMemo(() => {
    return branches.filter(b => b.branchName.toLowerCase().includes(searchItem.toLowerCase()));
  }, [branches, searchItem]);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans text-gray-800 overflow-x-hidden">
      
      {/* Header - Optimized for Mobile Stacking */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b pb-6 border-gray-100">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black uppercase italic flex items-center justify-center lg:justify-start gap-3 text-[#13786E]">
            <Building2 size={32} className="hidden sm:block" /> Branches Portal
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Total Active Locations: {branches.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Search branch..." 
                value={searchItem} 
                onChange={(e)=>setSearchItem(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-xs font-bold shadow-sm" 
             />
          </div>
          <button 
            onClick={() => setActiveForm(true)}
            className="w-full sm:w-auto bg-[#13786E] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={18}/> Register Branch
          </button>
        </div>
      </div>

      {/* BRANCH CARDS GRID - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
           <div className="col-span-full py-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#13786E]" size={32} />
              <span className="font-black text-xs uppercase text-[#13786E]">Syncing Branch Data...</span>
           </div>
        ) : filteredBranches.length === 0 ? (
           <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase italic text-xs tracking-widest">
              No branches found
           </div>
        ) : filteredBranches.map((b) => (
          <div key={b._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 md:p-6 shadow-sm hover:shadow-xl transition-all group border-t-4 border-t-[#13786E] flex flex-col">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${b.status === 'Active' ? 'bg-green-50 text-[#13786E]' : 'bg-red-50 text-red-600'}`}>
                   <Building2 size={24}/>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setViewBranch(b)} className="p-2.5 bg-blue-50 text-[#13786E] rounded-xl hover:bg-blue-100 transition-colors shadow-sm"><Eye size={16}/></button>
                   <button onClick={() => handleDelete(b._id)} className="p-2.5 bg-red-50 text-[#13786E] rounded-xl hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={16}/></button>
                </div>
             </div>

             <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1 truncate">{b.branchName}</h3>
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-1"><MapPin size={10}/> {b.city}</p>
             
             <div className="space-y-3 pt-4 border-t border-gray-50 flex-1">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                   <User size={14} className="text-gray-300 flex-shrink-0"/> <span className="text-gray-700 truncate">{b.managerName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                   <Phone size={14} className="text-gray-300 flex-shrink-0"/> <span className="text-gray-700">{b.contact}</span>
                </div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${b.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                   {b.status}
                </span>
                <p className="text-[9px] font-bold text-gray-400 italic">Est. {b.openingDate || "N/A"}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- ADD BRANCH MODAL - Fully Responsive Layout --- */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[95vh] shadow-2xl overflow-y-auto animate-in zoom-in duration-200">
             <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-widest flex items-center gap-3"><Plus size={24}/> New Branch</h2>
                <button onClick={() => {setActiveForm(false); resetForm();}}><X size={24} /></button>
             </div>
             
             <form onSubmit={(e)=>{e.preventDefault(); createBranch.mutate(branchForm);}} className="p-6 md:p-8 space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                   <FormInput label="Branch Name *" icon={<Building2 size={14}/>} value={branchForm.branchName} onChange={(e)=>setBranchForm({...branchForm, branchName: e.target.value})} />
                   <FormInput label="Manager Name *" icon={<User size={14}/>} value={branchForm.managerName} onChange={(e)=>setBranchForm({...branchForm, managerName: e.target.value})} />
                   <FormInput label="Contact Number *" icon={<Phone size={14}/>} value={branchForm.contact} onChange={(e)=>setBranchForm({...branchForm, contact: e.target.value})} />
                   <FormInput label="City *" icon={<Map size={14}/>} value={branchForm.city} onChange={(e)=>setBranchForm({...branchForm, city: e.target.value})} />
                   <FormInput label="Opening Date" type="date" icon={<Calendar size={14}/>} value={branchForm.openingDate} onChange={(e)=>setBranchForm({...branchForm, openingDate: e.target.value})} />
                   
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
                      <select className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#13786E] w-full" value={branchForm.status} onChange={(e)=>setBranchForm({...branchForm, status: e.target.value})}>
                         <option value="Active">Active</option>
                         <option value="Closed">Closed</option>
                      </select>
                   </div>
                </div>

                <div className="w-full">
                   <FormInput label="Full Address *" icon={<MapPin size={14}/>} value={branchForm.address} onChange={(e)=>setBranchForm({...branchForm, address: e.target.value})} />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                   <button type="button" onClick={()=>setActiveForm(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black uppercase text-[10px] text-gray-400 hover:bg-gray-50 transition-colors">Discard</button>
                   <button type="submit" disabled={createBranch.isPending} className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-2 transition-all hover:bg-indigo-700">
                      {createBranch.isPending ? <RefreshCw className="animate-spin" size={16}/> : "Register Branch"}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL - Mobile Optimized Profile --- */}
      {viewBranch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg max-h-[90vh] shadow-2xl overflow-y-auto animate-in zoom-in duration-200">
             <div className="bg-gray-900 p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
                <h2 className="text-lg font-black uppercase tracking-widest">Branch Profile</h2>
                <button onClick={() => setViewBranch(null)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
             </div>
             <div className="p-6 md:p-10 space-y-8">
                <div className="text-center">
                   <h3 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter">{viewBranch.branchName}</h3>
                   <span className={`mt-2 inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase border ${viewBranch.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{viewBranch.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                   <DetailBox label="Manager" value={viewBranch.managerName} icon={<User size={14}/>} />
                   <DetailBox label="Contact" value={viewBranch.contact} icon={<Phone size={14}/>} />
                   <DetailBox label="Location" value={viewBranch.city} icon={<Map size={14}/>} />
                   <DetailBox label="Established" value={viewBranch.openingDate || "N/A"} icon={<Calendar size={14}/>} />
                </div>

                <div className="bg-gray-50 p-5 md:p-6 rounded-3xl border border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Address</p>
                   <p className="text-sm font-bold text-gray-700 italic leading-relaxed">{viewBranch.address}</p>
                </div>

                <button onClick={() => setViewBranch(null)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">
                    Close Profile
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal Sub-components
const DetailBox = ({ label, value, icon }) => (
  <div className="overflow-hidden">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
      <span className="text-[#13786E]">{icon}</span> {label}
    </p>
    <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
  </div>
);

const FormInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input 
        {...props} 
        className="bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 shadow-inner w-full transition-all" 
    />
  </div>
);

export default BranchPage;