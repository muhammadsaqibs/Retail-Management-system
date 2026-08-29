import React, { useState, useMemo } from "react";
import { Plus, Trash2, Search, User, ShoppingBag, DollarSign, Calendar, MapPin, Phone, X, RefreshCw, ClipboardList, Loader2, Printer } from "lucide-react";
import { useMutation, useQueries, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const DebtPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();
  const [selectedDebtForPrint, setSelectedDebtForPrint] = useState(null);

  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const profile = authData?.user || storeUser;

  // 1. DATA FETCHING
  const results = useQueries({
    queries: [
      { queryKey: ['Debts'], queryFn: async () => (await axiosInstance.get('/debts/all')).data }
    ]
  });

  const debts = results[0]?.data?.data || [];
  const isLoading = results[0].isLoading;

  // 2. FORM STATE
  const [debtForm, setDebtForm] = useState({ 
    customerName: "", 
    products: "", 
    amount: "", 
    debtDate: new Date().toISOString().split('T')[0], 
    address: "", 
    contact: "", 
    expectedPayDate: "" 
  });

  const resetForm = () => {
    setDebtForm({ 
      customerName: "", products: "", amount: "", 
      debtDate: new Date().toISOString().split('T')[0], 
      address: "", contact: "", expectedPayDate: "" 
    });
  };

  // 3. ADD DEBT MUTATION
  const createDebt = useMutation({
    mutationFn: (payload) => axiosInstance.post('/debts/add', payload),
    onSuccess: () => { 
      queryClient.invalidateQueries(['Debts']); 
      toast.success("Debt Record Added Successfully!"); 
      setActiveForm(null); 
      resetForm(); 
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error adding record")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!debtForm.customerName || !debtForm.amount || !debtForm.contact) return toast.error("Fill required fields!");
    createDebt.mutate(debtForm);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this debt record?")) {
      try {
        await axiosInstance.delete(`/debts/delete/${id}`);
        queryClient.invalidateQueries(['Debts']);
        toast.info("Record removed");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredDebts = useMemo(() => {
    if (!Array.isArray(debts)) return [];
    return debts.filter(d => (d.customerName || "").toLowerCase().includes(searchItem.toLowerCase()));
  }, [debts, searchItem]);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans text-gray-800 overflow-x-hidden">
      
      {/* Header - Stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black uppercase italic flex items-center justify-center lg:justify-start gap-3 text-[#13786E]">
            <ClipboardList size={32} className="hidden sm:block" /> Debt Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Total Udhaar Records: {debts.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by customer..." 
              value={searchItem} onChange={(e) => setSearchItem(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold shadow-sm" 
            />
          </div>
          <button 
            onClick={() => { resetForm(); setActiveForm(activeForm === 'debt' ? null : 'debt'); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {activeForm === 'debt' ? <X size={18}/> : <Plus size={18}/>}
            {activeForm === 'debt' ? "Discard" : "New Debt Record"}
          </button>
        </div>
      </div>

      {/* FORM SECTION - Responsive Grid */}
      {activeForm === 'debt' && (
        <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormInput label="Customer Name *" icon={<User size={14}/>} value={debtForm.customerName} onChange={(e)=>setDebtForm({...debtForm, customerName: e.target.value})} />
              <FormInput label="Contact Number *" icon={<Phone size={14}/>} value={debtForm.contact} onChange={(e)=>setDebtForm({...debtForm, contact: e.target.value})} />
              <FormInput label="Udhaar Amount *" type="number" icon={<DollarSign size={14}/>} value={debtForm.amount} onChange={(e)=>setDebtForm({...debtForm, amount: e.target.value})} />
              <FormInput label="Products Taken" icon={<ShoppingBag size={14}/>} value={debtForm.products} onChange={(e)=>setDebtForm({...debtForm, products: e.target.value})} />
              <FormInput label="Debt Date" type="date" icon={<Calendar size={14}/>} value={debtForm.debtDate} onChange={(e)=>setDebtForm({...debtForm, debtDate: e.target.value})} />
              <FormInput label="Pay Back Date" type="date" icon={<RefreshCw size={14}/>} value={debtForm.expectedPayDate} onChange={(e)=>setDebtForm({...debtForm, expectedPayDate: e.target.value})} />
              <div className="sm:col-span-2 lg:col-span-3">
                <FormInput label="Customer Address" icon={<MapPin size={14}/>} value={debtForm.address} onChange={(e)=>setDebtForm({...debtForm, address: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
               <button type="submit" disabled={createDebt.isPending} className="w-full sm:w-auto px-10 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:bg-teal-700">
                  {createDebt.isPending ? <Loader2 className="animate-spin" size={16}/> : "Confirm & Save Entry"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SECTION - Responsive Scroll */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 md:px-8 py-5">Customer / Contact</th>
                <th className="px-6 md:px-8 py-5">Products</th>
                <th className="px-6 md:px-8 py-5">Udhaar Balance</th>
                <th className="px-6 md:px-8 py-5">Timeline</th>
                <th className="px-6 md:px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#13786E]" size={32} />
                    <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Loading Debt Records...</span>
                  </div>
                </td></tr>
              ) : filteredDebts.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase italic text-xs tracking-widest">No debts recorded found</td></tr>
              ) : filteredDebts.map((d) => (
                <tr key={d._id} className="hover:bg-red-50/20 transition-colors">
                  <td className="px-6 md:px-8 py-5">
                    <p className="font-black text-gray-800 text-sm uppercase">{d.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{d.contact}</p>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-xs text-gray-600 font-bold max-w-[200px] truncate">{d.products || "Multiple Items"}</td>
                  <td className="px-6 md:px-8 py-5 font-black text-red-600 text-sm">Rs. {Number(d.amount).toLocaleString()}</td>
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-black uppercase italic">Issued: {new Date(d.debtDate).toLocaleDateString()}</span>
                      <span className="text-[9px] text-[#13786E] font-black uppercase italic">Deadline: {d.expectedPayDate ? new Date(d.expectedPayDate).toLocaleDateString() : "No Date Set"}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center flex justify-center gap-2">
                      <button 
                        onClick={() => handleDelete(d._id)} 
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                        title="Delete Record"
                      >
                        <Trash2 size={16}/>
                      </button>
                      <button 
                        onClick={() => setSelectedDebtForPrint(d)}
                        className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
                        title="Print Udhaar Receipt"
                      >
                        <Printer size={16}/>
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INVOICE VIEW MODAL - Mobile Optimized --- */}
      {selectedDebtForPrint && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-6 md:p-10">
               <div className="text-center border-b border-dashed border-gray-200 pb-6">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-[#13786E]">{profile?.username || profile?.name || "Apexiums Retail"}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">{profile?.address || "Address Not Provided"}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-2">Tel: {profile?.phone || profile?.contact || "N/A"}</p>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[4px] bg-orange-50 inline-block px-3 py-1 rounded-full">Udhaar (Credit) Receipt</p>
               </div>
               
               <div className="py-6 grid grid-cols-2 gap-y-4 text-[11px] font-black text-gray-500 uppercase">
                  <div className="text-left">
                     <p className="text-gray-400">Customer (Udhaar To):</p>
                     <p className="text-gray-800 text-sm truncate">{selectedDebtForPrint.customerName}</p>
                     <p className="text-gray-500">{selectedDebtForPrint.contact}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-gray-400">Debt ID:</p>
                     <p className="text-gray-800 text-sm">{selectedDebtForPrint._id?.substring(0, 8) || "N/A"}</p>
                  </div>
                  <div className="text-left mt-2 border-t border-gray-100 pt-2">
                     <p className="text-gray-400">Issued On:</p>
                     <p className="text-gray-800">{new Date(selectedDebtForPrint.debtDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right mt-2 border-t border-gray-100 pt-2">
                     <p className="text-gray-400">Due Date:</p>
                     <p className="text-orange-600">{selectedDebtForPrint.expectedPayDate ? new Date(selectedDebtForPrint.expectedPayDate).toLocaleDateString() : "Not Specified"}</p>
                  </div>
               </div>

               <div className="border-t border-b border-gray-100 py-4">
                  <table className="w-full text-left">
                     <thead className="text-[9px] font-black text-gray-400 uppercase">
                        <tr>
                          <th className="pb-2">Items/Description</th>
                        </tr>
                     </thead>
                     <tbody className="text-xs font-bold text-gray-700">
                          <tr>
                            <td className="py-2">{selectedDebtForPrint.products || "Multiple Items"}</td>
                          </tr>
                     </tbody>
                  </table>
               </div>

               <div className="flex justify-between items-center pt-6 mb-6">
                  <p className="text-sm font-black uppercase text-gray-400">Total Udhaar</p>
                  <p className="text-2xl font-black text-red-600">Rs. {Number(selectedDebtForPrint.amount).toLocaleString()}</p>
               </div>

               <div className="text-center text-[10px] font-bold text-gray-800 border-t border-dashed border-gray-200 pt-6 mt-2 hidden print:block">
                  <p className="mb-2 italic text-gray-500">Thank you for your business!</p>
                  <p className="font-black uppercase text-[9px] tracking-widest text-[#13786E]">Software Developed By Apexiums Technologies</p>
                  <p className="font-black text-[9px] tracking-widest mt-1 text-gray-500">03405542097</p>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 pt-8 print:hidden">
                <button onClick={() => setSelectedDebtForPrint(null)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px] hover:bg-gray-50 transition-all">Close</button>
                <button onClick={() => window.print()} className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-teal-700 transition-all"><Printer size={16}/> Print Bill</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media print { 
          .lg\\:ml-64, button, .mt-14, .mb-8, .text-center.lg\\:text-left { display: none !important; } 
          body { background: white !important; padding: 0 !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; margin: 0 !important; }
          .fixed { position: static !important; background: white !important; padding: 0 !important; }
          .max-w-xl { max-width: 100% !important; border: none !important; box-shadow: none !important; }
          .bg-\\[\\#F8FAFC\\] { background: white !important; }
        }
      `}</style>
    </div>
  );
};

// Sub-component for Input fields
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

export default DebtPage;