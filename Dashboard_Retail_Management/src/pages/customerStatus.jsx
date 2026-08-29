import React, { useState, useEffect } from "react";
import { 
  Award, Plus, Edit2, Trash2, Search, X, 
  User, Phone, DollarSign, Calendar, AlertTriangle, Loader2 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const CustomerStatus = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyCustomer = { 
    name: "", contact: "", status: "Silver", totalSpent: "", lastVisit: new Date().toISOString().split('T')[0] 
  };
  const [currentCustomer, setCurrentCustomer] = useState(emptyCustomer);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/customers/all");
      // Backend returns { success: true, data: [] } usually, adjust if direct array
      setCustomers(res.data.data || res.data || []);
    } catch (error) {
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCustomer.name || !currentCustomer.contact || !currentCustomer.totalSpent) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentCustomer._id) {
        const res = await axiosInstance.put(`/customers/update/${currentCustomer._id}`, currentCustomer);
        const updated = res.data.data || res.data;
        setCustomers(customers.map((c) => (c._id === currentCustomer._id ? updated : c)));
        toast.success("Status updated successfully");
      } else {
        const res = await axiosInstance.post("/customers/add", currentCustomer);
        const newData = res.data.data || res.data;
        setCustomers([newData, ...customers]);
        toast.success("New customer added");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Remove this customer from status list?")) {
      try {
        await axiosInstance.delete(`/customers/delete/${id}`);
        setCustomers(customers.filter((c) => c._id !== id));
        toast.info("Customer removed");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const filteredCustomers = customers.filter((c) =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "platinum": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "defaulter": return "bg-red-100 text-red-700 border-red-200"; 
      case "gold": return "bg-orange-100 text-orange-700 border-orange-200";
      case "silver": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 lg:ml-64 ml-0 p-4 md:p-8 bg-gray-50 min-h-screen mt-14 font-sans text-left text-gray-800 overflow-x-hidden">
      
      {/* Header - Stack on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Customer Status</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] mt-1 uppercase">
            {isLoading ? "Syncing Database..." : "Live Loyalty & Warning Tracking"}
          </p>
        </div>
        <button
          onClick={() => { setCurrentCustomer(emptyCustomer); setIsModalOpen(true); }}
          className="w-full md:w-auto bg-[#13786E] text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Entry
        </button>
      </div>

      {/* Stats Section - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-500 shadow-inner"><Award size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Members</p>
            <h3 className="text-xl font-black">{customers.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-red-50 p-4 rounded-xl text-red-500 shadow-inner"><AlertTriangle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Defaulters List</p>
            <h3 className="text-xl font-black">
              {customers.filter(c => c.status?.toLowerCase() === 'defaulter').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400 flex-shrink-0" size={20} />
        <input
          type="text"
          placeholder="Search by name or tier (defaulter, gold...)"
          className="w-full outline-none bg-transparent font-bold text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section - Horizontal Scroll on Mobile */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Customer Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Tier Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Spent</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Last Visit</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-[#13786E]" size={32} />
                       <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Fetching Data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{c.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{c.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-[#13786E] text-sm">Rs. {Number(c.totalSpent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">{c.lastVisit}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setCurrentCustomer(c); setIsModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => deleteCustomer(c._id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 shadow-sm transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Fully Responsive Scrollable */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 md:p-8 sticky top-0 z-10 flex justify-between items-center text-white">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">{currentCustomer._id ? "Edit Status" : "New Registration"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Full Name</label>
                <input 
                  type="text" name="name" value={currentCustomer.name} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                  placeholder="e.g. Ali Ahmed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Tier</label>
                  <select name="status" value={currentCustomer.status} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-gray-50/50 text-sm font-bold outline-none focus:ring-2 focus:ring-[#13786E]">
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="defaulter">Defaulter (Warning)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Spent (Rs)</label>
                  <input type="number" name="totalSpent" value={currentCustomer.totalSpent} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-gray-50/50 text-sm font-black text-[#13786E] outline-none shadow-inner" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact No</label>
                  <input type="text" name="contact" value={currentCustomer.contact} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-gray-50/50 text-sm font-bold outline-none shadow-inner" placeholder="0300-XXXXXXX" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Purchase Date</label>
                  <input type="date" name="lastVisit" value={currentCustomer.lastVisit} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-gray-50/50 text-sm font-bold outline-none shadow-inner" />
                </div>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#0e5a52] transition-colors">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerStatus;