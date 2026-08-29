import React, { useState, useMemo } from "react";
import { 
  Plus, Trash2, Search, Building2, User, Phone, 
  MapPin, X, RefreshCw, Info, DollarSign, Briefcase, Eye
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const AgencyPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [viewAgency, setViewAgency] = useState(null); 
  const queryClient = useQueryClient();

  // 1. DATA FETCHING
  const results = useQueries({
    queries: [
      { queryKey: ['Agencies'], queryFn: async () => (await axiosInstance.get('/agencies/all')).data }
    ]
  });

  const agencies = results[0]?.data?.data || [];
  const isLoading = results[0].isLoading;

  // 2. FORM STATE
  const [agencyForm, setAgencyForm] = useState({ 
    agencyName: "", 
    contactPerson: "", 
    contactNumber: "", 
    address: "", 
    description: "", 
    totalBalance: "0" 
  });

  const resetForm = () => {
    setAgencyForm({ agencyName: "", contactPerson: "", contactNumber: "", address: "", description: "", totalBalance: "0" });
  };

  // 3. ADD AGENCY MUTATION
  const createAgency = useMutation({
    mutationFn: (payload) => axiosInstance.post('/agencies/add', payload),
    onSuccess: () => { 
      queryClient.invalidateQueries(['Agencies']); 
      toast.success("Agency Registered!"); 
      setActiveForm(null); 
      resetForm(); 
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error adding agency")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!agencyForm.agencyName || !agencyForm.contactNumber) return toast.error("Name and Contact are required!");
    createAgency.mutate(agencyForm);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this agency?")) {
      try {
        await axiosInstance.delete(`/agencies/delete/${id}`);
        queryClient.invalidateQueries(['Agencies']);
        toast.info("Agency deleted");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredAgencies = useMemo(() => {
    if (!Array.isArray(agencies)) return [];
    return agencies.filter(a => a.agencyName.toLowerCase().includes(searchItem.toLowerCase()));
  }, [agencies, searchItem]);

  return (
    <div className="flex-1 lg:ml-64 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black uppercase italic flex items-center justify-center lg:justify-start gap-3 text-[#13786E]">
            <Building2 size={32} className="hidden sm:block" /> Supply Agencies
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Partner Agencies: {agencies.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search agencies..." 
              value={searchItem} onChange={(e) => setSearchItem(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold shadow-sm" 
            />
          </div>
          <button 
            onClick={() => { resetForm(); setActiveForm(activeForm === 'agency' ? null : 'agency'); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {activeForm === 'agency' ? <X size={18}/> : <Plus size={18}/>}
            {activeForm === 'agency' ? "Discard" : "Add New Agency"}
          </button>
        </div>
      </div>

      {/* FORM SECTION - Responsive Grid */}
      {activeForm === 'agency' && (
        <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormInput label="Agency Name *" icon={<Building2 size={14}/>} value={agencyForm.agencyName} onChange={(e)=>setAgencyForm({...agencyForm, agencyName: e.target.value})} />
              <FormInput label="Contact Person" icon={<User size={14}/>} value={agencyForm.contactPerson} onChange={(e)=>setAgencyForm({...agencyForm, contactPerson: e.target.value})} />
              <FormInput label="Phone Number *" icon={<Phone size={14}/>} value={agencyForm.contactNumber} onChange={(e)=>setAgencyForm({...agencyForm, contactNumber: e.target.value})} />
              <FormInput label="Agency Balance" type="number" icon={<DollarSign size={14}/>} value={agencyForm.totalBalance} onChange={(e)=>setAgencyForm({...agencyForm, totalBalance: e.target.value})} />
              <div className="sm:col-span-2 lg:col-span-2">
                <FormInput label="Description / Supply Items" icon={<Briefcase size={14}/>} value={agencyForm.description} onChange={(e)=>setAgencyForm({...agencyForm, description: e.target.value})} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <FormInput label="Office Address" icon={<MapPin size={14}/>} value={agencyForm.address} onChange={(e)=>setAgencyForm({...agencyForm, address: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
               <button type="submit" disabled={createAgency.isPending} className="w-full sm:w-auto px-10 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                  {createAgency.isPending ? <RefreshCw className="animate-spin" size={16}/> : "Register Agency"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SECTION - Horizontal Scroll on Mobile */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Agency / Contact</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Pending Balance</th>
                <th className="px-8 py-5">Office Address</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center font-black animate-pulse text-[#13786E]">SYNCING AGENCY DATA...</td></tr>
              ) : filteredAgencies.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase italic text-xs">No agencies found</td></tr>
              ) : filteredAgencies.map((a) => (
                <tr key={a._id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-gray-800 text-sm uppercase">{a.agencyName}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{a.contactPerson || "No Name"} | {a.contactNumber}</p>
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-500 font-bold max-w-[200px] truncate">{a.description || "No description"}</td>
                  <td className="px-8 py-5 font-black text-[#13786E] text-sm">Rs. {Number(a.totalBalance).toLocaleString()}</td>
                  <td className="px-8 py-5 text-xs text-gray-400 font-medium italic truncate max-w-[150px]">{a.address || "N/A"}</td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setViewAgency(a)}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(a._id)} 
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                        title="Delete Agency"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- VIEW DETAILS MODAL - Mobile Optimized --- */}
      {viewAgency && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
             <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Building2 size={24} />
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">Agency Profile</h2>
                </div>
                <button onClick={() => setViewAgency(null)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
             </div>
             
             <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailItem label="Agency Name" value={viewAgency.agencyName} />
                  <DetailItem label="Contact Person" value={viewAgency.contactPerson || "Not Provided"} />
                  <DetailItem label="Phone Number" value={viewAgency.contactNumber} />
                  <DetailItem label="Current Balance" value={`Rs. ${Number(viewAgency.totalBalance).toLocaleString()}`} highlight />
                </div>
                
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                   <DetailItem label="Description / Supply Chain" value={viewAgency.description || "No specific details provided"} />
                   <DetailItem label="Registered Office Address" value={viewAgency.address || "No address on record"} />
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setViewAgency(null)} 
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg"
                  >
                    Close Agency Record
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal Helper Components
const DetailItem = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm font-bold ${highlight ? "text-[#13786E] font-black" : "text-gray-800"}`}>{value}</p>
  </div>
);

const FormInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input {...props} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 shadow-inner w-full" />
  </div>
);

export default AgencyPage;