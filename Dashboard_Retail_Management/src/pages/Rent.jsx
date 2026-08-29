import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, Edit2, Trash2, Search, X, 
  Calendar, CheckCircle, Clock, Loader2 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const RentManagement = () => {
  const [rentRecords, setRentRecords] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("August 2026");

  const monthsList = [
    "August 2026", "September 2026", "October 2026", "November 2026", "December 2026",
    "January 2027", "February 2027", "March 2027", "April 2027", "May 2027", 
    "June 2027", "July 2027", "August 2027"
  ];

  const emptyRecord = { 
    storeName: "", month: "August 2026", amount: "", status: "Pending", paymentDate: "" 
  };
  const [currentRecord, setCurrentRecord] = useState(emptyRecord);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rentRes, storesRes] = await Promise.all([
        axiosInstance.get("/rent/all"),
        axiosInstance.get("/stores/all")
      ]);
      setRentRecords(rentRes.data.data || []);
      const storesData = storesRes.data.data || storesRes.data || [];
      setStores(storesData);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to sync data from server");
      setRentRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. FILTER LOGIC ---
  const filteredRecords = useMemo(() => {
    if (!Array.isArray(rentRecords)) return [];
    return rentRecords.filter((r) => {
      const matchesSearch = (r.storeName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = r.month === filterMonth;
      return matchesSearch && matchesMonth;
    });
  }, [rentRecords, searchTerm, filterMonth]);

  // --- 3. DYNAMIC CALCULATIONS ---
  const totalCollected = useMemo(() => {
    return filteredRecords
      .filter(r => r.status === "Paid")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  }, [filteredRecords]);

  const totalPending = useMemo(() => {
    return filteredRecords
      .filter(r => r.status === "Pending")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  }, [filteredRecords]);

  // --- 4. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRecord.storeName || !currentRecord.month || !currentRecord.amount) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentRecord._id) {
        const res = await axiosInstance.put(`/rent/update/${currentRecord._id}`, currentRecord);
        const updatedObj = res.data.data || res.data;
        setRentRecords((prev) => prev.map((r) => (r._id === currentRecord._id ? updatedObj : r)));
        toast.success("Rent record updated");
      } else {
        const res = await axiosInstance.post("/rent/add", currentRecord);
        const newObj = res.data.data || res.data;
        setRentRecords((prev) => [newObj, ...prev]);
        toast.success("New rent record added");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const deleteRecord = async (id) => {
    if (window.confirm("Delete this rent record?")) {
      try {
        await axiosInstance.delete(`/rent/delete/${id}`);
        setRentRecords((prev) => prev.filter((r) => r._id !== id));
        toast.info("Record removed");
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  return (
    <div className="flex-1 lg:ml-64 ml-0 p-4 md:p-8 bg-gray-50 min-h-screen mt-14 font-sans text-left text-gray-800 overflow-x-hidden">
      
      {/* Header - Stack on Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Rent Management</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
             {isLoading ? "Syncing..." : `Viewing Data for ${filterMonth}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Month Selector Dropdown */}
          <div className="bg-white border border-gray-200 p-1.5 rounded-2xl flex items-center shadow-sm px-4 w-full sm:w-auto">
            <Calendar size={16} className="text-[#13786E]" />
            <select 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-2 pl-2 flex-1"
            >
              {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <button
            onClick={() => { setCurrentRecord({...emptyRecord, month: filterMonth}); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <Plus size={18} /> Add Entry
          </button>
        </div>
      </div>

      {/* Stats Cards - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-50 p-4 rounded-xl text-green-600 shadow-inner"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filterMonth} Collected</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-50 p-4 rounded-xl text-orange-600 shadow-inner"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filterMonth} Pending</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalPending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400 flex-shrink-0" size={20} />
        <input
          type="text"
          placeholder="Search by store name..."
          className="w-full outline-none text-gray-700 bg-transparent font-bold text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section - Horizontal Scrollable on Mobile */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Month</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#13786E]">
                      <Loader2 className="animate-spin" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Syncing with server...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-800 text-sm">{record.storeName}</td>
                    <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">{record.month}</td>
                    <td className="px-6 py-4 font-black text-gray-800 text-sm">Rs. {Number(record.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter ${
                        record.status === "Paid" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setCurrentRecord(record); setIsModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => deleteRecord(record._id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 shadow-sm transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-[4px]">
                      No records found
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Responsive Full Width on Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">{currentRecord._id ? "Update Rent" : "New Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                <select 
                  value={currentRecord.storeName} 
                  onChange={(e) => setCurrentRecord({...currentRecord, storeName: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold shadow-inner"
                  required
                >
                  <option value="">Select Store</option>
                  {stores.map(s => <option key={s._id} value={s.name || s.storeName}>{s.name || s.storeName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rent Month</label>
                  <select 
                    value={currentRecord.month}
                    onChange={(e) => setCurrentRecord({...currentRecord, month: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-[#13786E]"
                  >
                    {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (Rs)</label>
                  <input 
                    type="number" 
                    value={currentRecord.amount} 
                    onChange={(e)=>setCurrentRecord({...currentRecord, amount: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black shadow-inner outline-none focus:ring-2 focus:ring-[#13786E]" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select value={currentRecord.status} onChange={(e)=>setCurrentRecord({...currentRecord, status: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-[#13786E]">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Date</label>
                  <input type="date" value={currentRecord.paymentDate} onChange={(e)=>setCurrentRecord({...currentRecord, paymentDate: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-[#13786E]" />
                </div>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-gray-400 uppercase text-[10px] hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:bg-teal-700">Save Rent Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentManagement;