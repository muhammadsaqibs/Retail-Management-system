import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingDown, Plus, Edit2, Trash2, Search, X, 
  DollarSign, Calendar, Tag, FileText, Loader
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("August 2026"); // Default Start

  // --- 1. GENERATE MONTHS LIST (Aug 2026 - Aug 2027) ---
  const monthsList = [
    "August 2026", "September 2026", "October 2026", "November 2026", "December 2026",
    "January 2027", "February 2027", "March 2027", "April 2027", "May 2027", 
    "June 2027", "July 2027", "August 2027"
  ];

  const emptyExpense = { 
    title: "", category: "General", amount: "", date: new Date().toISOString().split('T')[0], note: "" 
  };
  const [currentExpense, setCurrentExpense] = useState(emptyExpense);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/expenses/all");
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setCurrentExpense({ ...currentExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentExpense.title || !currentExpense.amount || !currentExpense.date) {
      return toast.error("Please fill required fields");
    }
    try {
      if (currentExpense._id) {
        const res = await axiosInstance.put(`/expenses/update/${currentExpense._id}`, currentExpense);
        setExpenses(expenses.map((ex) => (ex._id === currentExpense._id ? res.data : ex)));
        toast.success("Expense updated");
      } else {
        const res = await axiosInstance.post("/expenses/add", currentExpense);
        setExpenses([res.data, ...expenses]);
        toast.success("Expense recorded");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save expense");
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axiosInstance.delete(`/expenses/delete/${id}`);
        setExpenses(expenses.filter((ex) => ex._id !== id));
        toast.info("Expense removed");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  // --- 2. FILTER LOGIC: Search + Month Filter ---
  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      // Search logic
      const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Month logic: date string "2026-08-15" contains "2026-08"
      // Convert "August 2026" to "2026-08" for comparison
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const [mName, year] = selectedMonth.split(" ");
      const mIndex = monthNames.indexOf(mName) + 1;
      const mFormatted = mIndex < 10 ? `0${mIndex}` : mIndex;
      const compareDate = `${year}-${mFormatted}`;

      return matchesSearch && ex.date.startsWith(compareDate);
    });
  }, [expenses, searchTerm, selectedMonth]);

  // --- 3. CALCULATE TOTAL (Only for filtered data) ---
  const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64 font-sans text-left">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Expense Tracker</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase">
            {isLoading ? "Syncing..." : `Viewing: ${selectedMonth}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* MONTH SELECTOR DROPDOWN */}
          <div className="bg-white border border-gray-200 p-2 rounded-2xl flex items-center shadow-sm px-4">
            <Calendar size={16} className="text-[#13786E]" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-2.5 pl-2"
            >
              {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <button
            onClick={() => { setCurrentExpense(emptyExpense); setIsModalOpen(true); }}
            className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            <Plus size={18} /> New Expense
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between mb-8 max-w-sm">
        <div className="flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-2xl text-red-500 shadow-inner">
            <TrendingDown size={30} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedMonth} Total</p>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Rs. {totalExpense.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Quick Search in this month..."
          className="w-full outline-none text-gray-700 bg-transparent font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Expense Details</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Category</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Amount</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredExpenses.map((ex) => (
              <tr key={ex._id} className="hover:bg-red-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{ex.title}</span>
                    <span className="text-[10px] text-gray-400 italic">Expense ID: {ex._id.slice(-6)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase border border-gray-200">
                    {ex.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{ex.date}</td>
                <td className="px-6 py-4 font-black text-red-500 text-sm">- Rs. {Number(ex.amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentExpense(ex); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteExpense(ex._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">No records for {selectedMonth}</div>}
      </div>

      {/* Modal - Same as before but consistent with date filter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-8 flex justify-between items-center text-white text-center">
              <h2 className="text-xl font-black uppercase tracking-widest w-full">{currentExpense._id ? "Edit Expense" : "New Expense"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expense Title</label>
                <input type="text" name="title" value={currentExpense.title} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select name="category" value={currentExpense.category} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold bg-gray-50/50">
                    <option value="General">General</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (Rs)</label>
                  <input type="number" name="amount" value={currentExpense.amount} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-black" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Expense</label>
                <input type="date" name="date" value={currentExpense.date} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm" />
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;